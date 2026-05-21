import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function App() {
  // 1. State untuk menampung list transaksi (Array of Objects)
  const [transaksi, setTransaksi] = useState([]);

  // 2. State untuk form input
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');

  // 3. Logika Menghitung Total Saldo (Menggunakan reduce)
  const totalSaldo = transaksi.reduce((total, item) => {
    if (item.tipe === 'masuk') {
      return total + item.nominal;
    } else {
      return total - item.nominal;
    }
  }, 0);

  // 4. Fungsi untuk Menambahkan Transaksi Baru
  const tambahTransaksi = (tipeTransaksi) => {
    // Validasi input tidak boleh kosong
    if (deskripsi.trim() === '' || nominal.trim() === '') {
      alert('Harap isi deskripsi dan nominal terlebih dahulu!');
      return;
    }

    // Pastikan nominal dirubah menjadi angka (number)
    const nominalAngka = parseFloat(nominal);
    if (isNaN(nominalAngka) || nominalAngka <= 0) {
      alert('Masukkan nominal angka yang valid!');
      return;
    }

    // Buat objek transaksi baru
    const transaksiBaru = {
      id: Date.now().toString(), // Membuat ID unik dari timestamp
      ket: deskripsi,
      nominal: nominalAngka,
      tipe: tipeTransaksi, // 'masuk' atau 'keluar'
    };

    // Update state array transaksi (taruh yang baru di paling atas list)
    setTransaksi([transaksiBaru, ...transaksi]);

    // Reset isi form input setelah berhasil menambah data
    setDeskripsi('');
    setNominal('');
  };

  // Fungsi helper untuk formatting mata uang Rupiah
  const formatRupiah = (angka) => {
    return 'Rp ' + angka.toLocaleString('id-ID');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flexContainer}
      >
        {/* --- HEADER SALDO --- */}
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Total Saldo Saat Ini</Text>
          <Text style={[
            styles.saldoText, 
            { color: totalSaldo >= 0 ? '#2bc48a' : '#e74c3c' } // Hijau jika positif, Merah jika minus
          ]}>
            {formatRupiah(totalSaldo)}
          </Text>
        </View>

        {/* --- FORM INPUT --- */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Tambah Transaksi Baru</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nominal"
            keyboardType="numeric"
            value={nominal}
            onChangeText={(text) => setNominal(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Keterangan"
            value={deskripsi}
            onChangeText={(text) => setDeskripsi(text)}
          />

          {/* Grid 2 Tombol */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.btn, styles.btnMasuk]} 
              onPress={() => tambahTransaksi('masuk')}
            >
              <Text style={styles.btnText}>PEMASUKAN↑</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btn, styles.btnKeluar]} 
              onPress={() => tambahTransaksi('keluar')}
            >
              <Text style={styles.btnText}>PENGELUARAN↓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- LIST HISTORY --- */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
          
          <FlatList
            data={transaksi}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <Text style={styles.itemKet}>{item.ket}</Text>
                
                {/* Conditional Styling Berdasarkan Tipe Transaksi */}
                <Text style={[
                  styles.itemNominal, 
                  { color: item.tipe === 'masuk' ? '#2bc48a' : '#e74c3c' }
                ]}>
                  {item.tipe === 'masuk' ? '+ ' : '- '}
                  {formatRupiah(item.nominal)}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLING (CSS-like) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  flexContainer: {
    flex: 1,
  },
  headerBox: {
    backgroundColor: '#2c3e50',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#dcdde1',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  saldoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1, // Mengisi ruang kosong sama rata (50:50)
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnMasuk: {
    backgroundColor: '#2bc48a',
  },
  btnKeluar: {
    backgroundColor: '#e74c3c',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyContainer: {
    flex: 1, // Memastikan flatlist mengambil sisa ruang paling bawah
    marginHorizontal: 16,
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
  },
  itemKet: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  itemNominal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 20,
    fontStyle: 'italic',
  }
});