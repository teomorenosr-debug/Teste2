package com.teo.gtaapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

// =============================================================
// MODELOS DE DADOS
// =============================================================
enum class PropertyType { APARTMENT, HOUSE, GARAGE, PENTHOUSE, AGENCY, OFFICE, WAREHOUSE, VEHICLE_WAREHOUSE }
enum class PropertyTier { HIGH, MEDIUM, LOW }

data class Property(
    val id: String,
    val name: String,
    val type: PropertyType,
    val tier: PropertyTier? = null,
    val location: String? = null,
    val value: Long = 0L
)

enum class VehicleType { CAR, MOTORCYCLE, BOAT, HELICOPTER, PLANE }

data class Vehicle(
    val id: String,
    val name: String,
    val type: VehicleType,
    val brand: String? = null,
    val garage: String? = null,
    val value: Long = 0L
)

data class Character(
    val name: String,
    val tag: String = "CEO",
    val netWorth: Long = 120_000_000L,
    val level: Int = 200
)

// =============================================================
// REPOSITÓRIO FAKE
// =============================================================
object FakeRepo {

    fun getCharacter(name: String) = Character(name = name)

    fun getProperties() = listOf(
        Property("p1", "Apartamento Eclipse Towers", PropertyType.APARTMENT, PropertyTier.HIGH, "Rockford Hills", 1_100_000),
        Property("p2", "Apartamento Del Perro", PropertyType.APARTMENT, PropertyTier.MEDIUM, "Del Perro", 450_000),
        Property("p3", "Penthouse Diamond Casino", PropertyType.PENTHOUSE, PropertyTier.HIGH, "Diamond Casino", 6_500_000),
        Property("p4", "Agência", PropertyType.AGENCY, null, "Little Seoul", 2_000_000),
        Property("p5", "Armazém de Veículos", PropertyType.VEHICLE_WAREHOUSE, null, "La Mesa", 1_500_000)
    )

    fun getVehicles() = listOf(
        Vehicle("v1", "Pegassi Zentorno", VehicleType.CAR, "Pegassi", "Eclipse Towers", 725_000),
        Vehicle("v2", "Oppressor Mk II", VehicleType.MOTORCYCLE, "Pegassi", "Terrorbyte", 3_890_000),
        Vehicle("v3", "Super Yacht Pisces", VehicleType.BOAT, "Galaxy", null, 6_000_000),
        Vehicle("v4", "Frogger", VehicleType.HELICOPTER, "Buckingham", "Yacht Heliport", 1_300_000)
    )
}

// =============================================================
// NAVEGAÇÃO
// =============================================================
object Routes {
    const val LOGIN = "login"
    const val HOME = "home"
    const val PROPERTIES = "properties"
    const val VEHICLES = "vehicles"
}

// =============================================================
// ACTIVITY PRINCIPAL
// =============================================================
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GTATheme {
                val navController = rememberNavController()
                AppNavHost(navController)
            }
        }
    }
}

// =============================================================
// THEME SIMPLES
// =============================================================
@Composable
fun GTATheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = lightColorScheme()) {
        content()
    }
}

// =============================================================
// NAVHOST (TUDO AQUI DENTRO)
// =============================================================
@Composable
fun AppNavHost(navController: NavHostController) {

    var character by remember { mutableStateOf<Character?>(null) }

    NavHost(navController = navController, startDestination = Routes.LOGIN) {

        // LOGIN
        composable(Routes.LOGIN) {
            LoginScreen { name ->
                character = FakeRepo.getCharacter(name)
                navController.navigate(Routes.HOME) {
                    popUpTo(Routes.LOGIN) { inclusive = true }
                }
            }
        }

        // HOME
        composable(Routes.HOME) {
            character?.let {
                HomeScreen(
                    it,
                    FakeRepo.getProperties(),
                    FakeRepo.getVehicles(),
                    onOpenProperties = { navController.navigate(Routes.PROPERTIES) },
                    onOpenVehicles = { navController.navigate(Routes.VEHICLES) }
                )
            }
        }

        // PROPERTIES
        composable(Routes.PROPERTIES) {
            PropertiesScreen(
                FakeRepo.getProperties(),
                onBack = { navController.popBackStack() }
            )
        }

        // VEHICLES
        composable(Routes.VEHICLES) {
            VehiclesScreen(
                FakeRepo.getVehicles(),
                onBack = { navController.popBackStack() }
            )
        }
    }
}

// =============================================================
// LOGIN SCREEN
// =============================================================
@Composable
fun LoginScreen(onLogin: (String) -> Unit) {
    var text by remember { mutableStateOf(TextFieldValue("")) }

    Box(
        Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {

            Text("SecuroServ Tracker", fontSize = 26.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(16.dp))

            OutlinedTextField(
                value = text,
                onValueChange = { text = it },
                label = { Text("Nome do personagem") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(Modifier.height(16.dp))

            Button(
                onClick = { if (text.text.isNotBlank()) onLogin(text.text.trim()) },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Entrar")
            }
        }
    }
}

// =============================================================
// HOME SCREEN (STATUS)
// =============================================================
@Composable
fun HomeScreen(
    character: Character,
    properties: List<Property>,
    vehicles: List<Vehicle>,
    onOpenProperties: () -> Unit,
    onOpenVehicles: () -> Unit
) {
    val totalProp = properties.sumOf { it.value }
    val totalVeh = vehicles.sumOf { it.value }
    val totalAssets = character.netWorth + totalProp + totalVeh

    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("STATUS", fontSize = 24.sp, fontWeight = FontWeight.Bold)

        Text("${character.name} [${character.tag}]", fontSize = 18.sp)

        Card(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("Net Worth: $${character.netWorth}")
                Text("Imóveis: $${totalProp}")
                Text("Veículos: $${totalVeh}")
                Divider(Modifier.padding(vertical = 8.dp))
                Text("Patrimônio Total: $${totalAssets}", fontWeight = FontWeight.Bold)
            }
        }

        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {

            ElevatedButton(
                onClick = onOpenProperties,
                modifier = Modifier.weight(1f)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Imóveis")
                    Text("${properties.size} ativos", style = MaterialTheme.typography.bodySmall)
                }
            }

            ElevatedButton(
                onClick = onOpenVehicles,
                modifier = Modifier.weight(1f)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Veículos")
                    Text("${vehicles.size} ativos", style = MaterialTheme.typography.bodySmall)
                }
            }
        }

        Text("Destaques rápidos", fontWeight = FontWeight.SemiBold)

        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(properties.take(3)) { SmallCard(it.name, "Imóvel") }
            items(vehicles.take(3)) { SmallCard(it.name, "Veículo") }
        }
    }
}

@Composable
fun SmallCard(title: String, subtitle: String) {
    Card(
        Modifier
            .width(220.dp)
            .height(100.dp)
    ) {
        Column(Modifier.padding(8.dp)) {
            Text(subtitle, style = MaterialTheme.typography.labelSmall)
            Text(title, fontWeight = FontWeight.SemiBold, maxLines = 2)
        }
    }
}

// =============================================================
// PROPERTIES SCREEN
// =============================================================
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PropertiesScreen(properties: List<Property>, onBack: () -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Imóveis") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Voltar")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            Modifier
                .padding(padding)
                .padding(16.dp)
        ) {
            items(properties) {
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(12.dp)) {
                        Text(it.name, fontWeight = FontWeight.Bold)
                        Text("Tipo: ${it.type}")
                        it.tier?.let { tier -> Text("Padrão: $tier") }
                        it.location?.let { loc -> Text("Localização: $loc") }
                        Text("Valor: $${it.value}")
                    }
                }
                Spacer(Modifier.height(8.dp))
            }
        }
    }
}

// =============================================================
// VEHICLES SCREEN
// =============================================================
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VehiclesScreen(vehicles: List<Vehicle>, onBack: () -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Veículos") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Voltar")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            Modifier
                .padding(padding)
                .padding(16.dp)
        ) {
            items(vehicles) {
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(12.dp)) {
                        Text(it.name, fontWeight = FontWeight.Bold)
                        Text("Tipo: ${it.type}")
                        it.brand?.let { b -> Text("Marca: $b") }
                        it.garage?.let { g -> Text("Garage: $g") }
                        Text("Valor: $${it.value}")
                    }
                }
                Spacer(Modifier.height(8.dp))
            }
        }
    }
}
