import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Hasil, ListCategories, Menus } from "../components"; 
import { API_URL } from "../utils/constants";
import axios from "axios";
import swal from "sweetalert";

export default class Home extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       menus: [],
       categoriYangDipilih: "Makanan",
       keranjangs: []
    }
  }

  componentDidMount() {
    // Ambil data produk berdasarkan kategori
    this.getProductsByCategory(this.state.categoriYangDipilih);
    // Ambil data keranjang
    this.getListKeranjang();
  }

  // Fungsi untuk mengambil produk berdasarkan kategori
  getProductsByCategory = (category) => {
    axios
      .get(API_URL + "products?category.nama=" + category)
      .then(res => {
        this.setState({ menus: res.data });
      })
      .catch(error => {
        console.log("Error get products: ", error);
      });
  }

  // Fungsi untuk mengambil data keranjang
  getListKeranjang = () => {
    axios
      .get(API_URL + "keranjangs")
      .then(res => {
        this.setState({ keranjangs: res.data });
      })
      .catch(error => {
        console.log("Error get keranjangs: ", error);
      });
  }

  // Ganti kategori
  changeCategory = (value) => {
    this.setState({
      categoriYangDipilih: value,
      menus: [] // Reset menus dulu agar loading
    }, () => {
      // Setelah state berubah, ambil produk baru
      this.getProductsByCategory(value);
    });
  }

  // Tambah ke keranjang
  masukKeranjang = (value) => {
    axios
      .get(API_URL + "keranjangs?product.id=" + value.id)
      .then(res => {
        if(res.data.length === 0) {
          // Jika belum ada di keranjang, buat baru
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value
          }
          axios
            .post(API_URL + "keranjangs", keranjang)
            .then(() => {
              this.getListKeranjang(); // Refresh keranjang
              swal({
                title: "Success!",
                text: value.nama + " berhasil ditambahkan ke keranjang",
                icon: "success",
                button: false,
                timer: 1500
              });
            })
            .catch(error => {
              console.log("Error post keranjang: ", error);
            });
        } else {
          // Jika sudah ada, update jumlah
          const existingItem = res.data[0];
          const keranjang = {
            jumlah: existingItem.jumlah + 1,
            total_harga: existingItem.total_harga + value.harga,
            product: value
          }
          axios
            .put(API_URL + "keranjangs/" + existingItem.id, keranjang)
            .then(() => {
              this.getListKeranjang(); // Refresh keranjang
              swal({
                title: "Success!",
                text: value.nama + " berhasil ditambahkan ke keranjang",
                icon: "success",
                button: false,
                timer: 1500
              });
            })
            .catch(error => {
              console.log("Error put keranjang: ", error);
            });
        }
      })
      .catch(error => {
        console.log("Error cek keranjang: ", error);
      });
  }
  
  render() {
    const { menus, categoriYangDipilih, keranjangs } = this.state;
    
    return (
      <div className="App">
        <Container fluid className="mt-3">
          <Row>
            <ListCategories 
              changeCategory={this.changeCategory} 
              categoriYangDipilih={categoriYangDipilih} 
            />
            <Col md={5} className="mt-3">
              <h4 className="text-center mb-3">
                <strong>🍽️ Daftar Produk</strong>
              </h4>
              <Row>
                {menus.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <p>Loading produk...</p>
                  </div>
                ) : (
                  menus.map((menu) => (
                    <Menus 
                      key={menu.id} 
                      menu={menu} 
                      masukKeranjang={this.masukKeranjang} 
                    />
                  ))
                )}
              </Row>
            </Col>
            <Hasil 
              keranjangs={keranjangs} 
              refreshKeranjang={this.getListKeranjang}
              {...this.props} 
            />
          </Row>
        </Container>
      </div>
    )
  }
}