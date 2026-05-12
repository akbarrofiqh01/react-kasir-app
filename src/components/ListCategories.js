import React, { Component } from 'react'
import { Col, Card, Row } from 'react-bootstrap'
import axios from 'axios'
import { API_URL } from '../utils/constants'
import { FaUtensils, FaCoffee, FaCookieBite } from 'react-icons/fa';

const Icon = ({nama}) => {
  if(nama === "Makanan") return <FaUtensils size={24} className='mr-2' color="#555" />
  if(nama === "Minuman") return <FaCoffee size={24} className='mr-2' color="#555" />
  if(nama === "Cemilan") return <FaCookieBite size={24} className='mr-2' color="#555" />
  return <FaUtensils size={24} className='mr-2' color="#555" />
}
export default class ListCategories extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       categories: []
    }
  }

  componentDidMount() {
    axios
      .get(API_URL + "categories")
      .then(res => {
        const categories = res.data;
        this.setState({categories});
      })
      .catch(error => {
        console.log("Error yaa ", error);
      });
  }

  render() {
    const { categories } = this.state;
    const { changeCategory, categoriYangDipilih } = this.props;
    return (
      <Col md={3} className="mt-3">
        <Card className="category-card">
          <Card.Header className="text-center bg-light">
            <h5 className="mb-0"><strong>📋 Daftar Kategori</strong></h5>
          </Card.Header>
          <Card.Body className="p-0">
            {categories && categories.map((category) => (
              <div 
                key={category.id} onClick={() => changeCategory(category.nama)}
                className={ `p-3 border-bottom category-item ${categoriYangDipilih === category.nama ? 'category-aktif' : ''}` }
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>
                  <Icon nama={category.nama} />
                </span>
                <strong>{category.nama}</strong>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    )
  }
}