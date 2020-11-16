import mongoose from 'mongoose'

mongoose.set('useCreateIndex', true)
export default () => mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/expressStarter', { useNewUrlParser: true })
