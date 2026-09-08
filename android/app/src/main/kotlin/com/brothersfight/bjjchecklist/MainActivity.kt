package com.brothersfight.bjjchecklist

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.brothersfight.bjjchecklist.ui.MainScreen
import com.brothersfight.bjjchecklist.ui.theme.BJJTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BJJTheme {
                MainScreen()
            }
        }
    }
}
