import api from '@/lib/api.js'

export default function handler(req, res) {
    console.log('Murat', req.query.id)
    return api.get(`users/${req.query.id}`)
        .then(response => {
            console.log('Muratcim', response)
            return res.status(200).json({
                success: true,
                message: "Giriş başarılı",
                response: response,
            })
        })
}
