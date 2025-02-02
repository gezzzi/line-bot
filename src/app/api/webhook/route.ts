import { WebhookRequestBody, Client } from '@line/bot-sdk';
import { NextResponse } from 'next/server';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

if (!config.channelAccessToken || !config.channelSecret) {
  throw new Error('LINE Channel Token または Secret が設定されていません');
}

const client = new Client({
  channelAccessToken: config.channelAccessToken,
  channelSecret: config.channelSecret
});

// 天気を取得する関数を追加
async function fetchWeather() {
  const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!WEATHER_API_KEY) {
    console.error('OpenWeather APIキーが設定されていません');
    return '天気の取得に失敗しました';
  }
  
  const city = 'Tokyo';
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&lang=ja&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.weather?.[0]?.description || !data.main?.temp) {
      throw new Error('不正なレスポンスデータ');
    }
    
    return `${data.weather[0].description}、気温は${Math.round(data.main.temp)}℃`;
  } catch (error) {
    console.error('天気の取得に失敗しました:', error);
    return '天気の取得に失敗しました';
  }
}

export const POST = async (req: Request) => {
  const body: WebhookRequestBody = await req.json();

  try {
    await Promise.all(body.events.map(async (event) => {
      if (event.type !== 'message' || event.message.type !== 'text') {
        return;
      }

      const { text } = event.message;
      
      if (text === '今日の日付') {
        const today = new Date();
        const dateString = today.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        });
        
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: `今日は${dateString}です。`
        });
      } else if (text === '今日の天気') {
        const weather = await fetchWeather();
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: `今日の天気は${weather}です。`
        });
      } else {
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: '申し訳ありません。「今日の日付」または「今日の天気」とメッセージを送信してください。'
        });
      }
    }));

    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
} 