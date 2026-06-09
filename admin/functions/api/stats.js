addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers })
    }

    // Debug: check what env looks like
    const envInfo = {
        envExists: typeof env !== 'undefined',
        envType: typeof env,
        envKeys: typeof env !== 'undefined' ? Object.keys(env) : [],
        envIsObject: typeof env === 'object'
    }

    const key = env ? (env.SUPABASE_SERVICE_ROLE_KEY || env['SUPABASE_SERVICE_ROLE_KEY']) : undefined

    if (!key) {
        return new Response(JSON.stringify({
            error: 'Server misconfigured: missing key',
            envInfo
        }), { status: 500, headers })
    }

    const url = 'https://aojysbbjethuqggvzivi.supabase.co/rest/v1/questionnaire_responses?select=*&order=created_at.desc'

    const res = await fetch(url, {
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
        }
    })

    if (!res.ok) {
        return new Response(JSON.stringify({ error: `Supabase error: ${res.status}` }), {
            status: 502,
            headers
        })
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200, headers })
}
