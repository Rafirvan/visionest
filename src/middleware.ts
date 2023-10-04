import { authMiddleware } from "@clerk/nextjs";



import { NextResponse, type NextRequest } from 'next/server';

// export function middleware(request:NextRequest) {
//     const referer = request.headers.get('Referer');

//     const response = NextResponse.next();

//     if (referer) {
//         response.cookies.set('previousRoute', referer, {
//             path: '/',
//             maxAge: 60 * 60, 
//             sameSite: 'strict',
//         });
//     }

//     return response;
// }

export default authMiddleware({
    beforeAuth: (req: NextRequest) => {
    const referer = req.headers.get('Referer');

    const response = NextResponse.next();

    if (referer) {
        response.cookies.set('previousRoute', referer, {
            path: '/',
            maxAge: 60 * 60,
            sameSite: 'strict',
        });
    }

    return response;
    },
    publicRoutes: ["/(.*)"]
});


export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
