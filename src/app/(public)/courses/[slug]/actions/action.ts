"use server";

import { requireUser } from "@/data/user/Require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);
export async function enrollmentCourseAction(
  courseId: string
): Promise<ApiResponse | never> {
  const session = await requireUser();
  let checkoutUrl: string;
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerPrint: session.id,
    });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been blocked",
      };
    }
    // create stripe id to user
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        price: true,
        title: true,
        id: true,
        stripePriceId: true,
      },
    });
    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }
    if (!course.stripePriceId) {
      return {
        status: "error",
        message: "Course price not configured",
      };
    }
    let stripeCustomerId: string;
    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        stripeCustomerId: true,
        id: true,
      },
    });
    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: session.email,
        name: session.name,
        metadata: {
          userId: session.id,
        },
      });
      stripeCustomerId = customer.id;
    }
    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        stripeCustomerId: stripeCustomerId,
      },
    });

    // create enrrolment between user and course
    const result = await prisma.$transaction(async (tx) => {
      const exisitingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.id,
            courseId: course?.id,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      let enrollment;
      if (exisitingEnrollment?.status === "Active") {
        return {
          status: "success",
          message: "You are already enrolled in this Course",
        };
      }

      if (exisitingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: exisitingEnrollment.id,
          },
          data: {
            amount: course?.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: session.id,
            courseId: course?.id as string,
            status: "Pending",
            amount: course?.price as number,
          },
        });
      }

      const checkoutSesssion = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: course.stripePriceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${process.env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: session.id,
          courseId: courseId,
          enrollmentId: enrollment.id,
        },
      });

      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSesssion.url,
      };
    });
    checkoutUrl = result.checkoutUrl as string;
  } catch (error) {
    console.log(error);
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Paymen system error, please try again later",
      };
    }
    return {
      status: "error",
      message: "Failed to enrollment course",
    };
  }
  redirect(checkoutUrl);
}
