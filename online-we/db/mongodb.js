const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/myblog', {useNewUrlParser: true, useUnifiedTopology: true})
  .catch(err => {
    console.log(err)
  })
mongoose.connection.on('connected', () => {
  console.log('mongodb数据库连接成功')
})
mongoose.connection.on("error", (error) => {
  console.log("mongodb数据库连接失败", error)
});

const footPrintSchema = mongoose.Schema({
  position: {type: Object, required: true},
  title: {type: String, required: true},
  time: {type: String},
  location: {type: String, required: true},
  content: {type: String},

})
const FootPrintModel = mongoose.model('footPrint', footPrintSchema)
exports.FootPrintModel = FootPrintModel

const diarySchema = mongoose.Schema({
  title: {type: String, required: true},
  time: {type: String, required: true},
  content: {type: String, required: true},
})
const DiaryModel = mongoose.model('daily', diarySchema)
exports.DiaryModel = DiaryModel

const urlSchema = mongoose.Schema({
  classis: {type: String, required: true},
  title: {type: String, required: true},
  time: {type: String, required: true},
  url: {type: String, required: true},
})
const UrlModel = mongoose.model('url', urlSchema)
exports.UrlModel = UrlModel

const timeLineSchema = mongoose.Schema({
  color: {type: String, required: true},
  time: {type: String, required: true},
  content: {type: String, require: true},
})
const TimeLineModel = mongoose.model('timeline', timeLineSchema)
exports.TimeLineModel = TimeLineModel

const todosSchema = mongoose.Schema({
  time: {type: String, required: true},
  content: {type: String, required: true},
  isChecked: {type: Boolean, required: true}
})
const TodosModel = mongoose.model('todo', todosSchema)
exports.TodosModel = TodosModel

const totalSchema = mongoose.Schema({
  postCount: {type: Number, required: true},
  urlCount: {type: Number, required: true},
  todoCount: {type: Number, required: true},
  dailyCount: {type: Number, required: true},
  footCount: {type: Number, required: true},
  photoCount: {type: Number, required: true},
  featCount: {type: Number, required: true},
  money: {type: Number, required: true}
})
const TotalModel = mongoose.model('total', totalSchema)
exports.TotalModel = TotalModel