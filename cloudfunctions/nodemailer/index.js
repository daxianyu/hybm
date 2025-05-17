// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
// 云函数入口文件
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  auth: {
    user: 'yaojingjian@ghqdedu.com',   //发邮件邮箱
    pass: '6WWo4b5dd6osu9CB'    //授权密码
  }
});

// 云函数入口函数
exports.main = async (event, context) => {
  //开始发送邮件
  const info = await transporter.sendMail(event.mailOptions);
  console.log('Message sent: ' + info.response);
  return info
}