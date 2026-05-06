import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/patients/:path*",
    "/consultations/:path*",
    "/prescriptions/:path*",
    "/billing/:path*",
    "/doctors/:path*",
    "/settings/:path*",
  ],
};
