//这是一个账户服务器的开始
var db = require('../utils/db');
var configs = require(process.argv[2]);

//init db pool.
//初始化mysql，就是连接数据库
db.init(configs.mysql());

//
//得到的configs account的配置信息
var config = configs.account_server();
//把整个account_server导进来开始
var as = require('./account_server');
//调用account_server.js的start方法导入配置信息
as.start(config);
//打牌也是
var dapi = require('./dealer_api');
dapi.start(config);