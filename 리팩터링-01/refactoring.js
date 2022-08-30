const plays = {
    "hamlet":{"name":"Hamlet","type":"tragedy"},
    "as-like":{"name":"As You Like","type":"comedy"},
    "othello":{"name":"Othello","type":"tragedy"}
}
const invoices = [
    {
        "customer":"BigCo",
        "performances":[
            {"playId":"hamlet","audience":55},
            {"playId":"as-like","audience":35},
            {"playId":"othello","audience":40}
        ]
    },
    {
        "customer":"JinUk",
        "performances":[
            {"playId":"hamlet","audience":95},
            {"playId":"as-like","audience":15},
            {"playId":"othello","audience":20}
        ]
    }
]
for(const invoice of invoices){
    console.log(statement(invoice))
}
for(const invoice of invoices){
    console.log(htmlStatement(invoice))
}

function statement(invoice){
    return renderText(createStatementData(invoice))
}

function htmlStatement(invoice){
    return renderHtml(createStatementData(invoice))
}

function renderText(data){
    let result = `청구내역 - 고객명: ${data.customer}\n`
    for(let perf of data.performances){
        result += ` ${perf.play.name}: ${usdFor(perf.amount)} (${perf.audience}석)\n`
    }
    result += `총액: ${usdFor(data.totalAmount)}\n`
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`
    return result
}

function renderHtml(data){
    let result = `<h1>청구내역 - 고객명: ${data.customer}</h1>\n`
    result += "<table>\n"
    result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>"
    for(let perf of data.performances){
        result += ` <tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td><td>${perf.amount}</td></tr>\n`
    }
    result += "</table>\n"
    result += `<p>총액: <em>${usdFor(data.totalAmount)}</em></p>\n`
    result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`
    return result
}

function usdFor(number){
    return new Intl.NumberFormat("en-US",
    {style:"currency",currency:"USD",maximumFractionDigits:2}).format(number/100)
}

function createStatementData(invoice){
    const statementData = {}
    statementData.customer = invoice.customer
    statementData.performances = invoice.performances.map(enrichPerformance)
    statementData.totalAmount = totalAmount(statementData)
    statementData.totalVolumeCredits = totalVolumeCredits(statementData)
    return statementData
    
    function enrichPerformance(performance){
        const result = Object.assign({},performance)
        result.play = playFor(result)
        result.amount = amountFor(result)
        result.volumeCredits = volumeCreditsFor(result)
        return result
    }

    function playFor(performance){
        return plays[performance.playId]
    }

    function amountFor(performance){
        let result = 0
        switch(performance.play.type){
            case "tragedy":
                result = 40000
                if(performance.audience > 30) result += 1000*(performance.audience - 30)
                break
            case "comedy":
                result = 30000
                if(performance.audience > 20) result += 10000 + 500*(performance.audience - 20)
                result += 300*performance.audience
                break
            default:
                throw new Error(`알수없는 장르: ${performance.play.type}`)
        }
        return result
    }

    function volumeCreditsFor(performance){
        let result = 0
        result += Math.max(performance.audience - 30,0)
        if(performance.play.type === "comedy") result += Math.floor(performance.audience / 5)
        return result
    }

    function totalVolumeCredits(data){
        return data.performances.reduce((total,perf)=>total+perf.volumeCredits,0)
    }
    
    function totalAmount(data){
        return data.performances.reduce((total,perf)=>total+perf.amount,0)
    }
}