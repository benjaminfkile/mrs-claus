const axios = require("axios")

const mailer = {
    sendMail: (email, name, amount, receiptUrl) => {

        let html =
        `<!doctype html>

        <html lang="en">
        
        <head>
            <meta charset="utf-8">
        
            <title>Donation Receipt</title>
            <meta name="description" content="The HTML5 Herald">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Mountains+of+Christmas&display=swap" rel="stylesheet">
        
        </head>
        
        <body>
            <div class="MessageWrapper" style="width: 100%;">
                <div class="Message"
                    style="border-radius: 5px; width: 80%; max-width: 500px; margin-top: 40px; margin-left: auto; margin-right: auto; padding-bottom: 20px; background-color: #1b2c2e; border: 1px solid #000000; text-align: center;">
                    <h1 style="font-size: 50px; color: #FFFFFF; font-family: 'Mountains of Christmas', cursive;">
                        Western Montana Santa Flyover</h1>
                    <h2 style="color:#FFFFFF">
                        We recieved your donation of</h2>
                    <p style="font-size: 50px; color: #087700; margin: 0px;">
                        $50
                    </p>
                    <p style="color:#FFFFFF; padding-left: 20px; padding-right: 20px; font-size: 20px;">
                        People like you help Santa Fly and bring Christmas cheer to children in Missoula and
                        surrounding
                        towns...
                        <br></br>
                        Seriously you rock!
                    </p>
                    <p style="color:#FFFFFF; padding-left: 20px; padding-right: 20px; font-size: 20px;
                    ">
                        Click the link below to view your receipt.
                    </p>
                    <a href="https://fonts.google.com/specimen/Mountains+of+Christmas?query=christmas" target="_blank"
                        style=" color: #087700;">
                        Receipt</a>
                </div>
            </div>
        </body>
        
        </html>`

        let rb = {
            from: "Western Montana Santa Flover",
            to: email,
            subject: "Your Recent Donation",
            text: `Thank you ${name} for your donation of $${amount}.`,
            html: html,
            key: process.env.MAILER_KEY
        }

        axios.post("https://glacial-plains-54815.herokuapp.com/send", rb)
            .then(res => {
                console.log(res.data)
            })
    }
}
module.exports = mailer