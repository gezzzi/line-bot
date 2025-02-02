/** @type {import('next').NextConfig} */
const nextConfig = {
    // LINEのWebhookからのPOSTリクエストを許可する
    async headers() {
        return [
            {
                source: '/api/webhook',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/json',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
