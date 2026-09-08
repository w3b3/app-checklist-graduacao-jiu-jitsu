package com.brothersfight.bjjchecklist.data

import android.os.Build
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import javax.inject.Inject
import javax.inject.Singleton

enum class FeedbackType(val label: String) {
    GENERAL("Elogio ou Sugestão"),
    BUG("Relatar Problema"),
    FEATURE("Pedir Nova Funcionalidade")
}

@Singleton
class FeedbackRepository @Inject constructor() {

    companion object {
        private const val TAG = "BJJFeedback"
        private const val FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeVcO3N1SQ0MuRelzZtTEFJ0LgfZCSDwyKat_99HSp8t0URtw/formResponse"
        
        private const val ENTRY_FEEDBACK_TYPE = "entry.375424062"
        private const val ENTRY_MESSAGE = "entry.1245682428"
        private const val ENTRY_EMAIL = "entry.1397640521"
        private const val ENTRY_BELT = "entry.862809321"
        private const val ENTRY_APP_VERSION = "entry.664067526"
        private const val ENTRY_DEVICE = "entry.793753316"
    }

    suspend fun sendFeedback(
        type: FeedbackType,
        message: String,
        email: String = "",
        belt: String = "Azul",
        appVersion: String = "2.0.0"
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val deviceString = "Android ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT}) | ${Build.MANUFACTURER} ${Build.MODEL}"

            val postDataParams = mutableMapOf<String, String>().apply {
                put(ENTRY_FEEDBACK_TYPE, type.label)
                put(ENTRY_MESSAGE, message)
                if (email.isNotBlank()) {
                    put(ENTRY_EMAIL, email.trim())
                }
                put(ENTRY_BELT, belt.replaceFirstChar { it.uppercase() })
                put(ENTRY_APP_VERSION, appVersion)
                put(ENTRY_DEVICE, deviceString)
            }

            val postData = postDataParams.entries.joinToString("&") { (key, value) ->
                "${URLEncoder.encode(key, "UTF-8")}=${URLEncoder.encode(value, "UTF-8")}"
            }

            Log.d(TAG, "Submitting feedback to Google Forms: $postData")

            val url = URL(FORM_URL)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                doOutput = true
                setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
                setRequestProperty("Content-Length", postData.toByteArray().size.toString())
                connectTimeout = 10000
                readTimeout = 10000
            }

            conn.outputStream.use { os ->
                os.write(postData.toByteArray(Charsets.UTF_8))
            }

            val responseCode = conn.responseCode
            Log.d(TAG, "Google Forms response code: $responseCode")
            responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_MOVED_TEMP || responseCode == 204
        } catch (e: Exception) {
            Log.e(TAG, "Error submitting feedback to Google Forms", e)
            true
        }
    }
}
