var express = require('express');
var router = express.Router();
const { TotalModel, TodosModel, TimeLineModel, FootPrintModel, DiaryModel, UrlModel } = require('../db/mongodb')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// 首页获取数据
router.get('/get-total', (req, res) => {
  TotalModel.find((err, total) => {
    err ? res.send ({success: false}) : res.send({success: true, data: total})
  })
})
// 获取时间线
router.get('/get-timeline', (req, res) => {
  TimeLineModel.find((err, timeline) => {
    err ? res.send ({success: false}) : res.send({success: true, data: timeline})
  })
})
// 添加时间线
router.post('/add-timeline', (req, res) => {
  const {time, color, content} = req.body
  new TimeLineModel({time, color, content}).save((err, timeline) => {
    TotalModel.findByIdAndUpdate({_id: '5daa6eb6111c0c675ee30d06'}, {$inc:{'featCount': 1}}, (err, total) => {
      console.log({err, total})
    })
    err ? res.send ({success: false}) : res.send({success: true, data: timeline})
  })
})
// 获取 todos
router.get('/get-todos', (req, res) => {
  TodosModel.find((err, todos) => {
    err ? res.send ({success: false}) : res.send({success: true, data: todos.reverse()})
  })
})
// 添加 todos
router.post('/add-todos', (req, res) => {
  const {content} = req.body
  const time = new Date().toLocaleDateString()
  new TodosModel({content, isChecked: false, time}).save((err, todo) => {
    TotalModel.findByIdAndUpdate({_id: '5daa6eb6111c0c675ee30d06'}, {$inc:{'todoCount': 1}}, (err, total) => {
      console.log({err, total})
    })
    err ? res.send ({success: false}) : res.send({success: true, data: todo})
  })
})
// 修改 todos
router.post('/modify-todos', (req, res) => {
  const {type, check} = req.body
  if (type) {
    TodosModel.find((err, todos) => {
      todos.map(it => {
        const {_id, isChecked} = it
        TodosModel.findByIdAndUpdate({_id}, {$set:{'isChecked': check}}, (err, todo) => {
          console.log({err, todo})
        })
      })
      err ? res.send ({success: false}) : res.send({success: true, data: todos})
    })
  } else {
    const {_id, isChecked} = req.body
    TodosModel.findByIdAndUpdate({_id}, {$set:{'isChecked': isChecked}}, (err, todo) => {
      err ? res.send ({success: false}) : res.send({success: true, data: todo})
    })
  }
})
// 删除 todos
router.post('/del-todos', (req, res) => {
  const {type} = req.body 
  if (type) {
    TodosModel.deleteMany({}, (err, todos) => {
      TotalModel.findByIdAndUpdate({_id: '5daa6eb6111c0c675ee30d06'}, {$set:{'todoCount': 0}}, (err, total) => {
        console.log({err, total})
      })
      err ? res.send ({success: false}) : res.send({success: true, todos})
    })
  } else {
    const {_id} = req.body
    TodosModel.deleteOne({_id}, (err, todos) => {
      TotalModel.findByIdAndUpdate({_id: '5daa6eb6111c0c675ee30d06'}, {$inc:{'todoCount': -1}}, (err, total) => {
        console.log({err, total})
      })
      err ? res.send ({success: false}) : res.send({success: true, todos})
    })
  }
})
// 获取足迹
router.get('/get-foot-print', (req, res) => {
  FootPrintModel.find((err, footPrints) => {
    err ? res.send ({success: false}) : res.send({success: true, data: footPrints})
  })
})
// 新增足迹
router.post('/add-foot-print', (req, res) => {
  let { position, location, title, url, content, time } = req.body
  console.log(req.body)
  new FootPrintModel({ position, location, title, url, content, time }).save((err, data) => {
    TotalModel.findByIdAndUpdate({_id: '5daa6eb6111c0c675ee30d06'}, {$inc:{'footCount': 1}}, (err, total) => {
      console.log({err, total})
    })
    err ? res.send ({success: false}) : res.send({success: true, data: data})
  })
})
// 获取日记
router.get('/get-diary', (req, res) => {
  DiaryModel.find((err, diarys) => {
    err ? res.send ({success: false}) : res.send({success: true, data: diarys.reverse()})
  })
})
// 新增日记
router.post('/add-diary', (req, res) => {
  let { title, content, time } = req.body
  new DiaryModel({ title, content, time }).save((err, data) => {
    TotalModel.findByIdAndUpdate({_id: '5daa6eb6111c0c675ee30d06'}, {$inc:{'dailyCount': 1}}, (err, total) => {
      console.log({err, total})
    })
    err ? res.send ({success: false}) : res.send({success: true, data: data})
  })
})
// 新增收藏
router.post('/add-url', (req, res) => {
  let { classis, title, url, time } = req.body
  new UrlModel({ classis, title, url, time }).save((err, data) => {
    TotalModel.findByIdAndUpdate({_id: '5daa6eb6111c0c675ee30d06'}, {$inc:{'urlCount': 1}}, (err, total) => {
      console.log({err, total})
    })
    err ? res.send ({success: false}) : res.send({success: true, data: data})
  })
})
// 获取收藏
router.get('/get-url', (req, res) => {
  UrlModel.find((err, urls) => {
    err ? res.send ({success: false}) : res.send({success: true, data: urls})
  })
})


router.post('/issue', (req, res) => {
  const {title, content, url, date, type} = req.body
  new PostModel({title, content, url, date, type, likeCount:0, commentCount:0, viewCount:0}).save((err, post) => {
    res.send()
  })
})

router.get('/postsList:keys', (req, res) => {
  const {keys} = req.params
  const id = keys.substring(keys.length - 1)
  PostModel.find((err, posts) => {
    posts = posts.sort((a, b) => b.date - a.date)
    switch(id) {
      case '0': 
        res.send(posts)
        return 
      case '1':
        posts = posts.filter(post => post.type.includes('前端'))
        res.send(posts)
        return
      case '2':
        posts = posts.filter(post => post.type.includes('后端'))
        res.send(posts)
        return
      case '3':
        posts = posts.filter(post => post.type.includes('数据库'))
        res.send(posts)
        return
      case '4':
        posts = posts.filter(post => post.type.includes('工具'))
        res.send(posts)
        return
      case '5':
        posts = posts.filter(post => post.type.includes('刷题'))
        res.send(posts)
        return
      case '6':
        posts = posts.filter(post => post.type.includes('日志'))
        res.send(posts)
        return
    }
  })
})

router.get('/postView:id', (req, res) => {
  const {id} = req.params
  const _id = id.substring(1)
  // PostModel.update({_id},{$inc:{'viewCount':1}})
  // PostModel.findOne({_id}, (err, post) => {
  //   console.log(post)
  //   res.send(post)
  // })
  PostModel.findByIdAndUpdate({_id}, {$inc:{'viewCount':1}}, (err, post) => {
    console.log(post)
    res.send(post)
  })
})

router.get('/commentsList:id', (req, res) => {
  const {id} = req.params
  const _id = id.substring(1)
  CommentModel.find((err, comments) => {
    comments = comments.filter(comment => _id === comment.postId ? true : false)
      .sort((a, b) => b.datetime - a.datetime)
    console.log(id, comments)
    res.send(comments)
  })
})

router.post('/comment', (req, res) => {
  const {postId, content, datetime} = req.body
  new  CommentModel({postId, content, datetime}).save((err, comment) => {
    PostModel.findByIdAndUpdate({_id: postId}, {$inc:{'commentCount':1}}, (err, post) => {
      console.log({err, post})
    })
    res.send()
  })
})

router.post('/like', (req, res) => {
  const {_id} = req.body
  PostModel.findByIdAndUpdate({_id}, {$inc:{'likeCount':1}}, (err, post) => {
    res.send()
  })
})

module.exports = router;
