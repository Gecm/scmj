package com.vivigames.scmj;

import android.app.Activity;
import android.content.Context;

import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.SendAuth;
import com.tencent.mm.sdk.openapi.SendMessageToWX;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.tencent.mm.sdk.openapi.WXMediaMessage;
import com.tencent.mm.sdk.openapi.WXWebpageObject;

public class WXAPI {
	public static IWXAPI api;
	public static Activity instance;
	public static boolean isLogin = false;
	public static void Init(Activity context){
		WXAPI.instance = context;
        // 通过WXAPIFactory工厂，获取IWXAPI的实例
		api = WXAPIFactory.createWXAPI(context, Constants.APP_ID, true);
        api.registerApp(Constants.APP_ID);		
	}
	
	private static String buildTransaction(final String type) {
	    return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
	}
	
	public static void Login(){
		isLogin = true;
		final SendAuth.Req req = new SendAuth.Req();
		req.scope = "snsapi_userinfo";
		req.state = "carjob_wx_login";
		api.sendReq(req);
		//instance.finish();
	}
	
	public static void Share(String url,String title,String desc){
		try{
			isLogin = false;
			WXWebpageObject webpage = new WXWebpageObject();
			webpage.webpageUrl = url;
			WXMediaMessage msg = new WXMediaMessage(webpage);
			msg.title = title;
			msg.description = desc;
			//msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
			
			SendMessageToWX.Req req = new SendMessageToWX.Req();
			req.transaction = buildTransaction("webpage");
			req.message = msg;
			req.scene = /*isTimelineCb.isChecked() ? SendMessageToWX.Req.WXSceneTimeline : */SendMessageToWX.Req.WXSceneSession;
			api.sendReq(req);
			//instance.finish();
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
}
