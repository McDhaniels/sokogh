export const STUDENT_EMAIL_DOMAIN = "@st.ug.edu.gh";

export function isStudentEmail(email) {
  return email.toLowerCase().trim().endsWith(STUDENT_EMAIL_DOMAIN);
}
