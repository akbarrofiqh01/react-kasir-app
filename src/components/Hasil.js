import React, { Component } from 'react'
import { Col, Card } from 'react-bootstrap'
import axios from 'axios'
import { API_URL } from '../utils/constants'
import TotalBayar from './TotalBayar'
import ModalKeranjang from './ModalKeranjang'

export default class Hasil extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      showModal: false,
      keranjangDetail: null,  // Ubah dari false ke null
      jumlah: 0,
      keterangan: "",
    }
  }

  handleShow = (menuKeranjang) => {
    this.setState({
      showModal: true,
      keranjangDetail: menuKeranjang,
      jumlah: menuKeranjang.jumlah,
      keterangan: menuKeranjang.keterangan || "",
    })
  }

  handleClose = () => {
    this.setState({
      showModal: false,
      keranjangDetail: null,  // Ubah ke null
    })
  }

  tambah = () => {
    this.setState({
      jumlah: this.state.jumlah + 1,
    })
  }

  kurang = () => {
    if(this.state.jumlah > 1) {  // Ubah kondisi
      this.setState({
        jumlah: this.state.jumlah - 1,
      })
    }
  }

  // Fungsi untuk menyimpan perubahan
  handleSaveChanges = () => {
    const { keranjangDetail, jumlah, keterangan } = this.state;
    
    if (keranjangDetail) {
      const updatedKeranjang = {
        ...keranjangDetail,
        jumlah: jumlah,
        keterangan: keterangan,
        total_harga: jumlah * keranjangDetail.product.harga
      };
      
      // Update ke API
      axios.put(API_URL + "keranjangs/" + keranjangDetail.id, updatedKeranjang)
        .then(() => {
          // Refresh data di parent component
          if (this.props.refreshKeranjang) {
            this.props.refreshKeranjang();
          }
          this.handleClose();
        })
        .catch(error => {
          console.error("Error update keranjang: ", error);
        });
    }
  }

  // Fungsi untuk menghapus pesanan
  handleDeleteOrder = () => {
    const { keranjangDetail } = this.state;
    
    if (keranjangDetail) {
      axios.delete(API_URL + "keranjangs/" + keranjangDetail.id)
        .then(() => {
          if (this.props.refreshKeranjang) {
            this.props.refreshKeranjang();
          }
          this.handleClose();
        })
        .catch(error => {
          console.error("Error delete keranjang: ", error);
        });
    }
  }

  render() {
    const { keranjangs } = this.props;
    
    // Buat objek untuk modal yang menggabungkan keranjangDetail dengan jumlah & keterangan terbaru
    const modalKeranjangDetail = this.state.keranjangDetail ? {
      ...this.state.keranjangDetail,
      jumlah: this.state.jumlah,
      keterangan: this.state.keterangan
    } : null;
    
    return (
      <Col md={4} className="mt-3">
        <Card className="hasil-card">
          <Card.Header className="text-center">
            <h5 className="mb-0"><strong>🛒 Hasil / Keranjang</strong></h5>
          </Card.Header>
          <Card.Body>
            {!keranjangs || keranjangs.length === 0 ? (
              <div className="text-center text-muted py-4">
                <span style={{ fontSize: '48px' }}>🛒</span>
                <p className="mt-2">Keranjang masih kosong</p>
              </div>
            ) : (
              <>
                {keranjangs.map((menuKeranjang) => (
                  <div 
                    key={menuKeranjang.id} 
                    className="cart-item d-flex justify-content-between align-items-center" 
                    onClick={() => this.handleShow(menuKeranjang)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div className="cart-item-title">{menuKeranjang.product?.nama}</div>
                      <small className="text-muted">
                        {menuKeranjang.jumlah} x Rp {menuKeranjang.product?.harga?.toLocaleString('id-ID')}
                      </small>
                    </div>
                    <div className="cart-item-price">
                      Rp {(menuKeranjang.jumlah * menuKeranjang.product?.harga).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
                <TotalBayar keranjangs={keranjangs} {...this.props} />
                
                <ModalKeranjang 
                  showModal={this.state.showModal}
                  handleClose={this.handleClose}
                  keranjangDetail={modalKeranjangDetail}
                  tambah={this.tambah}
                  kurang={this.kurang}
                  keterangan={this.state.keterangan}
                  handleSave={this.handleSaveChanges}
                  handleDelete={this.handleDeleteOrder}
                  onKeteranganChange={(e) => this.setState({ keterangan: e.target.value })}
                />
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    )
  }
}