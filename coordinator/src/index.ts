import express from 'express'
import spawn from 'child_process'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    console.log(req.body)
    res.json({ message: 'Hello World' })
})

app.post('/compile', (req, res) => {
    const { code, lang } = req.body
    if (!code || !lang) {
        console.log('Code and lang are required fields')
        return res
            .status(400)
            .json({ message: 'Code and lang are required fields' })
    }
    let imageName
    switch (lang) {
        case 'python':
            imageName = 'python3_compiler_service'
            break
        case 'java':
            imageName = 'java_compiler_service'
            break
        case 'c':
            imageName = 'c_compiler_service'
            break
        default:
            return res.status(400).json({ message: 'Invalid language' })
    }
    console.log(lang, code)
    res.json({ lang, code })
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})
