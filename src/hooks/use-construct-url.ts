export default function useConstructUrl(key: string): string {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;
}


// https://lms.project.next.jsx.t3.storage.dev/
// lms.project.next.jsx.t3.storage.dev








