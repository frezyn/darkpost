import { prisma } from "@workspace/database";
import { NextResponse } from "next/server";

export const sendYuan = async (userCss: string | null, value: number, paymendId: string) => {
  try {
    if (!userCss)
      return NextResponse.json({ status: "error to send yuans to the user." });


    //esse codigo tem script injection 😆, melhor fazer uma checagem de input.
    const response = await fetch("https://cssbuy.com/web/user/transferAccount", {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": "Vz3jTXW9WTYdWQricU9RN3S2wHwQ7ROZQ6hbYJJl",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "lang=en; __cflb=0H28vRQL5UFeq2e7WFsHPSBRo7nNjMuAnbnFTUqMjRn; popup=%23%202025%20National%20Day%20Holiday%20Notice; www.echatsoft.com_521933_encryptVID=dpO5DfDbVr3AvGXgLzpw0A%3D%3D; www.echatsoft.com_521933_chatVisitorId=4564530119; echat_firsturl=--1; echat_firsttitle=--1; echat_referrer_timer=echat_referrer_timeout; echat_referrer=--1; echat_referrer_pre=; loginauth=2cbf4T5ZkSvXZR1ZjTzXrPD%2BpWmTYlCtM5svZQL7y64MTSvt8HJ3AVI%2BGt9Z2I4KyfSA2kx3nr96kHMiZTtKcniajJcShokabE74XBY; loginip=0.0.0.0; ECHAT_521933_web4564530119_miniHide=0; laravel_session=eyJpdiI6ImQ3Vy9KRVBnN2NFQ1NNWFR3TysrY1E9PSIsInZhbHVlIjoicWZiamJla3k2c0ZJVGZpOXBpend3WFZXNFJiM3FScFRZbnFzTXA1eGsrakREWTFOWEE3cUZNdkZsSnhrTFRPRFlCZmZHUHF4emlHUytuek5iY0lvZWx4MXowclJzZUt5Yy9WUXk5K09VMy94ck5wMys3Q1YvSEJOcnorQTNUNmIiLCJtYWMiOiJhNjA3MzEwYWI5YWRhMmJmZjYzMWYwMjIxNTc3ZDNmMDc2ZTA2MmRkMTdhNzQ5NmIwMTM2OTMxMDBkOTRjNDRhIiwidGFnIjoiIn0%3D",
        "Referer": "https://cssbuy.com/web/user"
      },
      "body": `transfer_account_name=${userCss}&transfer_money=${value}&transfer_password=${process.env.PASSWORD_CSS}&transfer_remark=recarge:${userCss}`,
      "method": "POST"
    });
    if (response.status === 0) {
      console.log("yuans enviados")
    }
    return NextResponse.json({ status: "error to send yuans to the user." });
  } catch (err) {
    console.error(err);
  }
};


