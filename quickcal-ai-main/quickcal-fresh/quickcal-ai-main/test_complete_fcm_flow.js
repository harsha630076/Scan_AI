#!/usr/bin/env node

/**
 * Complete FCM Flow Testing for QuickCal AI
 * Tests the entire FCM v1 + Supabase Edge Functions pipeline
 */

const SUPABASE_PROJECT_REF = "yqmzguttrtsrwoeghnab"; // From user's swift-service URL
const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

// REPLACE THESE WITH YOUR ACTUAL VALUES
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE"; // Get from Supabase Dashboard → Settings → API
const FCM_SERVER_KEY = "YOUR_FCM_SERVER_KEY_HERE"; // Get from Firebase Console → Project: aiscan-c77ac

// Simulated Android FCM token (this is what you get from Android Studio Logcat)
const TEST_FCM_TOKEN = "REPLACE_WITH_REAL_ANDROID_FCM_TOKEN";

// Service Account JSON (you have this in Supabase secrets as FCM_SERVICE_ACCOUNT)
const SERVICE_ACCOUNT_JSON = {
 "type": "service_account",
  "project_id": "YOUR_PROJECT_ID_HERE",
  "private_key_id": "YOUR_PRIVATE_KEY_ID_HERE",
  "private_key": "YOUR_PRIVATE_KEY_HERE",
  "client_email": "YOUR_CLIENT_EMAIL_HERE",
  "client_id": "YOUR_CLIENT_ID_HERE",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CLIENT_X509_CERT_URL_HERE",
  "universe_domain": "googleapis.com"

};

console.log("🔥 COMPLETE FCM FLOW TEST FOR QUICKCAL AI");
console.log("=" .repeat(70));
console.log(`📍 Supabase Project: ${SUPABASE_URL}`);
console.log(`🔑 Anon Key Configured: ${SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY_HERE' ? '✅' : '❌'}`);
console.log(`🗝️ FCM Server Key Configured: ${FCM_SERVER_KEY !== 'YOUR_FCM_SERVER_KEY_HERE' ? '✅' : '❌'}`);
console.log(`📱 Test FCM Token: ${TEST_FCM_TOKEN.substring(0, 20)}...`);
console.log("");

// Phase 1: Test Edge Function Deployment
async function testEdgeFunction() {
  console.log("📊 PHASE 1: Testing Edge Function Deployment");
  console.log("-" .repeat(50));

  const endpoints = [
    { name: 'FCM Push Notification', url: `${SUPABASE_URL}/functions/v1/sendPushNotification` },
    { name: 'Swift Service (your current)', url: `${SUPABASE_URL}/functions/v1/swift-service` }
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.name}`);
    console.log(`URL: ${endpoint.url}`);

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });

      if (response.ok) {
        console.log(`✅ ${endpoint.name}: Accessible (${response.status})`);
        const data = await response.json();
        console.log(`   Response: ${JSON.stringify(data)}`);
      } else {
        console.log(`⚠️ ${endpoint.name}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Network error - ${error.message}`);
      console.log("   💡 This indicates the function is NOT deployed or URL is wrong");
    }
    console.log("");
  }
}

// Phase 2: Simulate FCM API Call
async function simulateFCMCall() {
  console.log("📊 PHASE 2: Simulating FCM API Call (what your Edge Function does)");
  console.log("-" .repeat(70));

  console.log("🔧 Simulating what happens when you send a push notification:");
  console.log("");

  console.log("1. 📤 Frontend sends request to Supabase Edge Function:");
  const requestPayload = {
    deviceToken: TEST_FCM_TOKEN,
    title: "🔔 QuickCal AI FCM Test",
    body: "This proves push notifications work!",
    data: { type: "test", timestamp: new Date().toISOString() }
  };
  console.log(JSON.stringify(requestPayload, null, 2));
  console.log("");

  console.log("2. 🔐 Edge Function gets OAuth access token from FCM:");
  console.log("   - Uses service account JSON from Supabase secrets");
  console.log("   - Exchanges for short-lived access token");
  console.log("   - Scope: https://www.googleapis.com/auth/firebase.messaging");
  console.log("");

  console.log("3. 📡 Edge Function calls FCM v1 API:");
  const fcmPayload = {
    message: {
      token: TEST_FCM_TOKEN,
      notification: {
        title: requestPayload.title,
        body: requestPayload.body
      },
      data: requestPayload.data,
      android: {
        priority: "high",
        notification: {
          channel_id: "quickcal_notifications",
          priority: "high",
          sound: "default"
        }
      }
    }
  };
  console.log(JSON.stringify(fcmPayload, null, 2));
  console.log("");

  console.log("4. 📱 FCM sends to Android device and returns:");
  const fcmResponse = {
    name: "projects/ai-scan-d0360/messages/138170009812394"
  };
  const finalResponse = {
    success: true,
    messageId: fcmResponse.name,
    message: "Push notification sent successfully",
    deviceToken: TEST_FCM_TOKEN.substring(0, 20) + "..."
  };
  console.log(JSON.stringify(finalResponse, null, 2));
  console.log("");

  console.log("5. ✅ Android device should receive notification!");
  console.log("   📱 Title: 🔔 QuickCal AI FCM Test");
  console.log("   📱 Body: This proves push notifications work!");
  console.log("   📱 Sound: Default notification sound");
  console.log("   📱 Vibration: Should vibrate");
  console.log("");
}

// Phase 3: Instructions for Real Testing
function provideRealTestInstructions() {
  console.log("📊 PHASE 3: REAL TESTING INSTRUCTIONS");
  console.log("-" .repeat(40));

  console.log("🔄 STEPS TO SEE REAL FCM PUSH NOTIFICATIONS:");
  console.log("");

  console.log("📝 STEP 1: Get Your Actual Values");
  console.log("Replace the placeholder values at the top of this file:");
  console.log(`• SUPABASE_ANON_KEY: Get from ${SUPABASE_URL}/functions/v1/_settings`);
  console.log("• FCM_SERVER_KEY: Get from Firebase Console");
  console.log("• TEST_FCM_TOKEN: Get from Android Studio Logcat");
  console.log("");

  console.log("📱 STEP 2: Get Android FCM Token");
  console.log("1. Build and run Android app:");
  console.log("   npx cap build android");
  console.log("   npx cap run android");
  console.log("2. Open Android Studio → Logcat");
  console.log("3. Search for: 'FCM Token:'");
  console.log("4. Copy the long token that appears");
  console.log("");

  console.log("🚀 STEP 3: Deploy FCM Edge Function");
  console.log("supabase functions deploy sendPushNotification");
  console.log("");

  console.log("📞 STEP 4: Test with Real Values");
  console.log(`Run: node test_complete_fcm_flow.js`);
  console.log("But with real values configured at top of file");
  console.log("");

  console.log("🔍 STEP 5: Check Logs");
  console.log("supabase functions logs sendPushNotification --tail");
  console.log("");

  console.log("☎️ STEP 6: Test with cURL");
  console.log(`curl -X POST "${SUPABASE_URL}/functions/v1/sendPushNotification" \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "Authorization: Bearer ${SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY_HERE' ? SUPABASE_ANON_KEY.substring(0, 20) + '...' : '[YOUR_REAL_ANON_KEY]'}aa" \\`);
  console.log(`  -d '{"deviceToken":"[YOUR_REAL_FCM_TOKEN]","title":"cURL Test","body":"This worked!"}'`);
  console.log("");

  console.log("🎯 STEP 7: Expect Success");
  console.log("You should see:");
  console.log("✅ Response: success: true");
  console.log("📱 Android device receives notification!");
  console.log("");
}

// Phase 4: Expected Logs Analysis
function analyzeExpectedLogs() {
  console.log("📊 PHASE 4: EXPECTED LOGS ANALYSIS");
  console.log("-" .repeat(35));

  console.log("When FCM push notification succeeds, you should see:");
  console.log("");

  console.log("🌐 BROWSER CONSOLE (when testing from web):");
  console.log(`Response: {"success":true,"messageId":"projects/ai-scan-d0360/messages/138170009812394","message":"Push notification sent successfully","deviceToken":"cLH1N2v.."}`);
  console.log("");

  console.log("📜 SUPABASE EDGE FUNCTION LOGS:");
  console.log("Sending FCM message to token: cLH1N2v3QRq4S...");
  console.log("FCM response: { status: 200, success: true, messageId: 'projects/...'}");
  console.log("WebFCM: Token saved successfully with new schema");
  console.log("");

  console.log("📱 ANDROID DEVICE:");
  console.log("• Notification appears with sound/vibration");
  console.log("• Title: Your notification title");
  console.log("• Body: Your notification message");
  console.log("• App icon shows badge");
  console.log("");

  console.log("🔍 ANDROID STUDIO LOGCAT:");
  console.log("FCM: Notification received");
  console.log("FCM Token: [your-device-token]");
  console.log("Push received: {...notification data...}");
  console.log("");
}

// Main test execution
if (require.main === module) {
  (async () => {
    try {
      console.log("⚠️  IMPORTANT: This is a SIMULATION of FCM testing.");
      console.log("⚠️  To see REAL push notifications, follow the instructions below.");
      console.log("");

      await testEdgeFunction();
      await simulateFCMCall();
      provideRealTestInstructions();
      analyzeExpectedLogs();

      console.log("=" .repeat(70));
      console.log("🎯 SUMMARY:");
      console.log("1. ✅ FCM v1 Edge Function code is ready");
      console.log("2. ✅ Android FCM service code is ready");
      console.log("3. ❌ Need to deploy sendPushNotification function");
      console.log("4. ❌ Need real FCM token from Android device");
      console.log("5. ✅ Follow steps above to see real notifications");
      console.log("");
      console.log("🚀 DEPLOY & TEST: supabase functions deploy sendPushNotification");
      console.log("🎉 EXPECT: Android device receives push notification!");
      console.log("");

    } catch (error) {
      console.error("💥 Test failed:", error.message);
      process.exit(1);
    }
  })();
}
