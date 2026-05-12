import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { API_URL } from '../utils/constants'

export default class TotalBayar extends Component {
  submitTotalBayar = (totalBayar) => {
    const { keranjangs } = this.props;
    
    // Buat data pesanan untuk disimpan ke localStorage
    const pesananData = {
      id: Date.now(),
      orderNumber: 'INV-' + Date.now(),
      tanggal: new Date().toISOString(),
      total_bayar: totalBayar,
      menus: keranjangs.map(item => ({
        id: item.id,
        jumlah: item.jumlah,
        total_harga: item.jumlah * item.product.harga,
        product: item.product,
        keterangan: item.keterangan || ""
      }))
    };
    
    // Simpan ke localStorage untuk ditampilkan di halaman sukses
    localStorage.setItem('lastOrder', JSON.stringify(pesananData));
    
    // Kirim ke API
    const pesanan = {
      total_bayar: totalBayar,
      menus: keranjangs
    }

    axios.post(API_URL + "pesanans", pesanan)
      .then(() => {
        // Hapus semua keranjang setelah checkout
        const deletePromises = keranjangs.map(item => 
          axios.delete(API_URL + "keranjangs/" + item.id).catch(() => {})
        );
        
        Promise.all(deletePromises).then(() => {
          // Refresh keranjang di parent component
          if (this.props.refreshKeranjang) {
            this.props.refreshKeranjang();
          }
          // Redirect ke halaman sukses
          this.props.history.push("/sukses");
        });
      })
      .catch(error => {
        console.error("Error membuat pesanan: ", error);
        alert("Terjadi kesalahan, silakan coba lagi.");
      });
  };
  
  render() {
    const totalBayar = this.props.keranjangs.reduce((total, item) => {
      return total + (item.jumlah * item.product.harga);
    }, 0); 
    
    return (
      <div className="total-bayar mt-3">
        <div className="d-flex justify-content-between">
            <strong>Total Bayar:</strong>
            <strong style={{ color: '#22668A', fontSize: '1.2rem' }}>
                Rp {totalBayar.toLocaleString('id-ID')}
            </strong>
        </div>
        <Button 
          variant="primary" 
          className="btn-checkout w-100 mt-3" 
          onClick={() => this.submitTotalBayar(totalBayar)}
        >
            💳 Bayar Sekarang
        </Button>
      </div>
    )
  }
}