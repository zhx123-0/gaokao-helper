const https = require('https')

const TOKEN = 'pat_13ZVrE2XuafsklTzmcCq8F9DjllxWqEyob6v5iBlZL23MF1vVyTfQmVqEOx1h3Ri'

exports.main = async (event) => {
  const prompt = event.prompt || ''
  const botId = event.bot_id || '7648155992223563791'

  const postData = JSON.stringify({
    bot_id: botId, user_id: 'mp-47', stream: true, auto_save_history: false,
    additional_messages: [{ role: 'user', content: prompt, content_type: 'text' }]
  })

  return new Promise((resolve) => {
    const req = https.request('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
      timeout: 85000
    }, (res) => {
      let answer = '', buf = ''
      res.on('data', chunk => {
        buf += chunk.toString()
        const lines = buf.split('\n')
        buf = lines.pop() || ''
        lines.forEach(line => {
          if (line.startsWith('data:')) {
            const d = line.slice(5).trim()
            if (d === '[DONE]') return
            try {
              const ev = JSON.parse(d)
              if (ev.type === 'answer' && ev.content && !answer.includes(ev.content)) answer += ev.content
            } catch (e) {}
          }
        })
      })
      res.on('end', () => {
        answer = answer.replace(/\{"msg_type".*?\}/g, '').replace(/\{"type":"follow_up".*?\}/g, '').trim()
        resolve({ content: answer || 'AI返回为空' })
      })
    })
    req.on('error', () => resolve({ content: 'AI不可用' }))
    req.on('timeout', () => { req.destroy(); resolve({ content: 'AI超时，请重试' }) })
    req.write(postData)
    req.end()
  })
}
