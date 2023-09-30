import { NextApiRequest, NextApiResponse } from 'next';
 // {
    //     user: {
    //       name: string
    //       email: string
    //       image: string
    //     },
    //     expires: Date // This is the expiry of the session, not any of the tokens within the session
    //   }
export default function index(req: NextApiRequest, res: NextApiResponse) {
    const resData = {
        user: {
            name: 'tetrisman',
            email: 'emeralddev92@gmail.com',
            image: 'https://fastly.picsum.photos/id/448/200/200.jpg?hmac=bBnq1esMuSqfETvk9QP1YhdRdXQTSPJDKoQFvvJGfrQ'
        },
        expires: '2023-09-30T20:30:59.999Z'
    }
    if(req.method == 'GET')
        res.status(200).json({ session: resData });
}