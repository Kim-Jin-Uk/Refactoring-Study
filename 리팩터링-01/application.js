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
    console.log(statement(invoice,plays))
}

function statement(invoice,plays){
    let totalAmount = 0
    let volumeCredits = 0
    let result = `청구내역 - 고객명: ${invoice.customer}\n`
    const format = new Intl.NumberFormat("en-US",
    {style:"currency",currency:"USD",maximumFractionDigits:2}).format

    for(let perf of invoice.performances){
        const play = plays[perf.playId]
        let thisAmmount = 0
        switch(play.type){
            case "tragedy":
                thisAmmount = 40000
                if(perf.audience > 30) thisAmmount += 1000*(perf.audience - 30)
                break
            case "comedy":
                thisAmmount = 30000
                if(perf.audience > 20) thisAmmount += 10000 + 500*(perf.audience - 20)
                thisAmmount += 300*perf.audience
                break
            default:
                throw new Error(`알수없는 장르: ${play.type}`)
        }
        volumeCredits += Math.max(perf.audience - 30,0)
        if(play.type === "comedy") volumeCredits += Math.floor(perf.audience / 5)
        result += ` ${play.name}: ${format(thisAmmount/100)} (${perf.audience}석)\n`
        totalAmount += thisAmmount
    }
    result += `총액: ${format(totalAmount/100)}\n`
    result += `적립 포인트: ${volumeCredits}점\n`
    return result
}