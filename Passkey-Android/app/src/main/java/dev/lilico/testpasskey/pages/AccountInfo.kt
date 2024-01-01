package dev.lilico.testpasskey.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun AccountInfo() {
    Column(
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 0.dp, start = 30.dp, end = 30.dp, bottom = 30.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(color = Color.LightGray)
            .padding(20.dp)
    ) {

        Column(verticalArrangement = Arrangement.spacedBy(5.dp)) {

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Mnemonic", fontSize = 18.sp, fontWeight = FontWeight.Bold)


                Text("Account Account Account Account Account Account Account Account Account Account Account Account",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Normal)
            }

            Divider()

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("BIP44", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("m/44'/539'/0'/0/0", fontSize = 16.sp, fontWeight = FontWeight.Normal)
            }

            Divider()

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("PublicKey", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("0x1234567890", fontSize = 16.sp, fontWeight = FontWeight.Normal)
            }

            Divider()

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("SignAlgo", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("ECDSA_P256", fontSize = 16.sp, fontWeight = FontWeight.Normal)
            }

            Divider()

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("HashAlgo", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("SHA256", fontSize = 16.sp, fontWeight = FontWeight.Normal)
            }
        }
    }
}

@Preview(showSystemUi = true)
@Composable
fun AccountInfoPreview() {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
            AccountInfo()
        }
    }
}