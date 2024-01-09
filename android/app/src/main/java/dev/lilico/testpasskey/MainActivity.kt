package dev.lilico.testpasskey

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import dagger.hilt.android.AndroidEntryPoint
import dev.lilico.testpasskey.pages.AccountCard
import dev.lilico.testpasskey.pages.AccountHandler
import dev.lilico.testpasskey.pages.AccountInfo
import dev.lilico.testpasskey.passkey.Passkey
import dev.lilico.testpasskey.ui.theme.TestPasskeyTheme

class MainActivity : ComponentActivity() {

    lateinit var passkey: Passkey
    lateinit var accountHandler: AccountHandler

    init {
        System.loadLibrary("TrustWalletCore")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        passkey = Passkey(this)
        accountHandler = AccountHandler(passkey)
        setContent {
            TestPasskeyTheme(darkTheme = true) {
                ScreenMain()
            }
        }
    }

    @Composable
    fun ScreenMain() {
        val navController = rememberNavController()
        NavHost(navController = navController, startDestination = "main") {
            composable("main") {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    AccountCard(accountHandler)
                    if (accountHandler.userInfo != null) {
                        AccountInfo(accountHandler.userInfo!!)
                    }
                }
            }
        }
    }
}

@Preview(showSystemUi = true)
@Composable
fun GreetingPreview() {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
            AccountCard(AccountHandler(Passkey(LocalContext.current)))
//            AccountInfo(AccountHandler(Passkey(LocalContext.current)))
        }
    }
}