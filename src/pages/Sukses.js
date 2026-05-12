import React, { Component } from 'react'
import { Button, Container, Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { FaCheckCircle, FaHome, FaReceipt, FaClock, FaCalendarAlt, FaPrint, FaWhatsapp } from 'react-icons/fa';

export default class Sukses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: null,
      loading: true
    };
  }

  componentDidMount() {
    // Ambil data pesanan dari localStorage (dari TotalBayar)
    const lastOrder = localStorage.getItem('lastOrder');
    
    if (lastOrder) {
      const orderData = JSON.parse(lastOrder);
      this.setState({ 
        orderData: orderData,
        loading: false 
      });
      
      // Optional: Hapus dari localStorage setelah 5 detik (biar tidak numpuk)
      setTimeout(() => {
        localStorage.removeItem('lastOrder');
      }, 5000);
    } else {
      this.setState({ loading: false });
    }
  }

  formatRupiah = (angka) => {
    return 'Rp ' + (angka || 0).toLocaleString('id-ID');
  }

  getTotalBayar = () => {
    const { orderData } = this.state;
    if (!orderData || !orderData.menus) return 0;
    return orderData.menus.reduce((total, item) => total + (item.jumlah * item.product.harga), 0);
  }

  handlePrint = () => {
    window.print();
  }

  handleWhatsApp = () => {
    const { orderData } = this.state;
    if (!orderData) return;
    
    const itemsList = orderData.menus.map((item, idx) => 
      `${idx + 1}. ${item.product.nama} x${item.jumlah} = ${this.formatRupiah(item.jumlah * item.product.harga)}`
    ).join('\n');
    
    const message = `Halo, saya sudah melakukan pemesanan dengan detail:

*Nomor Order:* ${orderData.orderNumber}
*Total Bayar:* ${this.formatRupiah(this.getTotalBayar())}
*Tanggal:* ${new Date(orderData.tanggal).toLocaleString('id-ID')}

*Daftar Pesanan:*
${itemsList}

Terima kasih!`;
    
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
  }

  render() {
    const { orderData, loading } = this.state;
    
    if (loading) {
      return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Memuat detail pesanan...</p>
          </div>
        </Container>
      );
    }
    
    if (!orderData || !orderData.menus || orderData.menus.length === 0) {
      return (
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow-lg border-0 rounded-4 text-center">
                <Card.Body className="p-5">
                  <FaCheckCircle size={80} className="text-success mb-3" />
                  <h3 className="mb-3">✅ Pemesanan Berhasil!</h3>
                  <p className="text-muted mb-4">Terima kasih sudah memesan di Kasir App.</p>
                  <p className="text-muted mb-4">Silakan cek pesanan Anda di halaman utama.</p>
                  <Button 
                    variant="primary" 
                    as={Link} 
                    to="/"
                    className="px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                    style={{ backgroundColor: '#22668A', border: 'none' }}
                  >
                    <FaHome /> Kembali ke Home
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }

    const orderDate = new Date(orderData.tanggal);
    
    return (
      <Container className="my-5" id="print-area">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* Card Utama */}
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              {/* Header Gradient */}
              <div className="text-center p-4" style={{ background: 'linear-gradient(135deg, #22668A 0%, #2c7da0 100%)' }}>
                <FaCheckCircle size={80} className="text-white mb-3" />
                <h1 className="text-white fw-bold mb-2">✅ Pemesanan Berhasil!</h1>
                <p className="text-white-50 mb-0">Terima kasih sudah memesan di Kasir App</p>
              </div>

              <Card.Body className="p-4">
                {/* Title Detail */}
                <div className="border-bottom pb-3 mb-4">
                  <h4 className="d-flex align-items-center gap-2 mb-0">
                    <FaReceipt className="text-primary" /> 
                    <strong>Detail Pemesanan</strong>
                  </h4>
                </div>

                {/* Informasi Pemesanan */}
                <Row className="mb-4 g-3">
                  <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                      <div className="d-flex gap-2">
                        <FaReceipt className="text-primary mt-1" />
                        <div>
                          <small className="text-muted d-block">No. Order</small>
                          <strong><Badge bg="primary" className="fs-6">{orderData.orderNumber}</Badge></strong>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light p-3 rounded-3">
                      <div className="d-flex gap-2">
                        <FaCalendarAlt className="text-primary mt-1" />
                        <div>
                          <small className="text-muted d-block">Tanggal & Waktu</small>
                          <strong>{orderDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                          <div className="small">{orderDate.toLocaleTimeString('id-ID')}</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Tabel Pesanan */}
                <h5 className="mb-3">📋 Daftar Pesanan</h5>
                <div className="table-responsive mb-4">
                  <Table className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '45%' }}>Nama Produk</th>
                        <th style={{ width: '15%' }} className="text-center">Qty</th>
                        <th style={{ width: '20%' }} className="text-end">Harga</th>
                        <th style={{ width: '20%' }} className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.menus.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <strong>{item.product.nama}</strong>
                            {item.keterangan && (
                              <div className="text-muted small mt-1">
                                <em>📝 Catatan: {item.keterangan}</em>
                              </div>
                            )}
                          </td>
                          <td className="text-center">
                            <Badge bg="secondary" className="rounded-pill">
                              {item.jumlah}
                            </Badge>
                          </td>
                          <td className="text-end">{this.formatRupiah(item.product.harga)}</td>
                          <td className="text-end fw-bold">{this.formatRupiah(item.jumlah * item.product.harga)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-light">
                        <td colSpan="4" className="text-end fw-bold fs-5">Total Bayar:</td>
                        <td className="text-end fw-bold text-primary fs-4">
                          {this.formatRupiah(this.getTotalBayar())}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>

                {/* Informasi Penting */}
                <div className="alert alert-info d-flex align-items-start gap-3 mb-4">
                  <FaReceipt className="text-primary fs-4 mt-1" />
                  <div>
                    <strong>Informasi Penting:</strong>
                    <ul className="mb-0 mt-1">
                      <li>Simpan nomor order ini untuk mengambil pesanan Anda</li>
                      <li>Tunjukkan ke kasir saat mengambil pesanan</li>
                      <li>Pesanan akan diproses dalam waktu 15-30 menit</li>
                    </ul>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <Button 
                    variant="primary" 
                    as={Link} 
                    to="/"
                    className="px-4 py-2 rounded-pill d-flex align-items-center gap-2"
                    style={{ backgroundColor: '#22668A', border: 'none' }}
                  >
                    <FaHome /> Kembali ke Home
                  </Button>
                  <Button 
                    variant="success" 
                    className="px-4 py-2 rounded-pill d-flex align-items-center gap-2"
                    onClick={this.handleWhatsApp}
                  >
                    <FaWhatsapp /> Konfirmasi WA
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="px-4 py-2 rounded-pill d-flex align-items-center gap-2"
                    onClick={this.handlePrint}
                  >
                    <FaPrint /> Cetak Struk
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-muted">
                ❤️ Terima kasih telah berbelanja di Kasir App
              </small>
            </div>
          </Col>
        </Row>

        {/* CSS untuk Print */}
        <style>
          {`
            @media print {
              .btn, .navbar, .alert, .modal-footer, footer {
                display: none !important;
              }
              .card {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
              }
              body {
                background: white !important;
                margin: 0;
                padding: 0;
              }
              #print-area {
                margin: 0 !important;
                padding: 0 !important;
              }
              .bg-light {
                background-color: #f8f9fa !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .badge {
                border: 1px solid #ddd;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          `}
        </style>
      </Container>
    )
  }
}