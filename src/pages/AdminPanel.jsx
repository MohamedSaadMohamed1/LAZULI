import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu, Card, Col, Row, Statistic, Table, Button, Modal, Form, Input, InputNumber, Select, Popconfirm, Badge, Space, Tag, message } from 'antd';
import { 
  ShieldAlert, Plus, Package, DollarSign, Users, Settings, 
  Trash2, Edit, FileDown, Eye, Check, AlertCircle, ShoppingCart 
} from 'lucide-react';
import { getFirestoreDb } from '../firebase/config';

const { Sider, Content } = Layout;

export default function AdminPanel({ allProducts, onRefreshProducts, t, lang, getBilingualValue }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeMenuKey, setActiveMenuKey] = useState('dashboard'); // 'dashboard' | 'products' | 'orders'
  
  // Search and CRUD Modals state
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm] = Form.useForm();

  const governorates = [
    { id: 'Cairo', name_en: 'Cairo', name_ar: 'القاهرة' },
    { id: 'Giza', name_en: 'Giza', name_ar: 'الجيزة' },
    { id: 'Alexandria', name_en: 'Alexandria', name_ar: 'الإسكندرية' }
  ];

  const getCityName = (cityKey) => {
    const gov = governorates.find(g => g.id === cityKey);
    return gov ? (lang === 'EN' ? gov.name_en : gov.name_ar) : cityKey;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const db = getFirestoreDb();
      const res = await db.getOrders();
      const ordersList = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersList);
    } catch (e) {
      console.error("Failed to load orders:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const db = getFirestoreDb();
      await db.updateOrder(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      message.success(lang === 'EN' ? `Order updated to ${newStatus}!` : `تم تحديث حالة الطلب إلى ${newStatus}!`);
    } catch (e) {
      console.error("Failed to update status:", e);
      message.error(lang === 'EN' ? 'Failed to update order.' : 'فشل تحديث حالة الطلب.');
    }
  };

  // CRUD Product Actions
  const handleOpenProductModal = (prod = null) => {
    setEditingProduct(prod);
    if (prod) {
      productForm.setFieldsValue({
        name_en: prod.name_en,
        name_ar: prod.name_ar,
        price: prod.price,
        stock: prod.stock,
        category_en: prod.category_en,
        subcategory_en: prod.subcategory_en || 'Earrings',
        collection_en: prod.collection_en || "Nature's Mosaic",
        stone_en: prod.stone_en || 'None',
        material_en: prod.material_en || 'Pure Copper',
        image: prod.image,
        hoverImage: prod.hoverImage || '',
        description_en: prod.description_en,
        description_ar: prod.description_ar,
        details_en_str: prod.details_en ? prod.details_en.join(', ') : '',
        details_ar_str: prod.details_ar ? prod.details_ar.join(', ') : ''
      });
    } else {
      productForm.resetFields();
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (values) => {
    const db = getFirestoreDb();
    
    // Auto translate some category and collection keys for safety
    const categoryAr = values.category_en === 'Handmade Copper' ? 'النحاس الهاند ميد' : values.category_en === 'Precious Stones' ? 'الأحجار الكريمة الهاند ميد' : 'الهدايا والبوكسات';
    const subcategoryAr = values.subcategory_en === 'Earrings' ? 'أقراط' : values.subcategory_en === 'Necklaces' ? 'قلادات' : values.subcategory_en === 'Bracelets' ? 'أساور' : values.subcategory_en === 'Rings' ? 'خواتم' : 'دبابيس بروش';
    
    const detailsEnArray = values.details_en_str ? values.details_en_str.split(',').map(s => s.trim()).filter(Boolean) : ["Premium Cairo artisan handcrafted jewelry"];
    const detailsArArray = values.details_ar_str ? values.details_ar_str.split(',').map(s => s.trim()).filter(Boolean) : ["قطع مجوهرات راقية مصنوعة يدوياً بأيدي صائغي القاهرة"];

    const productPayload = {
      name_en: values.name_en,
      name_ar: values.name_ar,
      price: parseFloat(values.price),
      stock: parseInt(values.stock),
      category_en: values.category_en,
      category_ar: categoryAr,
      subcategory_en: values.subcategory_en,
      subcategory_ar: subcategoryAr,
      collection_en: values.collection_en,
      collection_ar: values.collection_en === "Nature's Mosaic" ? "فسيفساء الطبيعة" : values.collection_en === "El Kawthar" ? "الكوثر" : values.collection_en === "Oumy" ? "أمي" : "الخط العربي",
      stone_en: values.stone_en,
      stone_ar: values.stone_en === 'Turquoise' ? 'فيروز' : values.stone_en === 'Lapis Lazuli' ? 'لازورد' : values.stone_en === 'Amethyst' ? 'أميثيست' : values.stone_en === 'Malachite' ? 'مالاشيت' : 'لا يوجد حجر',
      material_en: values.material_en,
      material_ar: values.material_en === 'Pure Copper' ? 'نحاس نقي مطروق' : 'نحاس مطلي بذهب عيار 18',
      image: values.image,
      hoverImage: values.hoverImage || '',
      description_en: values.description_en,
      description_ar: values.description_ar,
      details_en: detailsEnArray,
      details_ar: detailsArArray,
      
      // Default fields
      name: values.name_en,
      category: values.category_en,
      collection: values.collection_en,
      stone: values.stone_en,
      description: values.description_en,
      details: detailsEnArray
    };

    try {
      if (editingProduct) {
        // Edit/Update behavior (specifically updating LocalStorage mock fallback or Firestore doc)
        if (db.updateProduct) {
          // If Firestore direct updates configured
          await db.updateProduct(editingProduct.id, productPayload);
        } else {
          // Mock or custom fallback update in localStorage
          const localProducts = JSON.parse(localStorage.getItem('mock_products') || '[]');
          const idx = localProducts.findIndex(p => p.id === editingProduct.id);
          if (idx !== -1) {
            localProducts[idx] = { id: editingProduct.id, ...productPayload };
            localStorage.setItem('mock_products', JSON.stringify(localProducts));
          }
        }
        message.success(lang === 'EN' ? 'Product updated successfully!' : 'تم تحديث قطعة المجوهرات بالكتالوج بنجاح!');
      } else {
        // Add new product
        await db.addProduct(productPayload);
        message.success(lang === 'EN' ? 'Product added successfully!' : 'تم صياغة وإضافة القطعة الفنية بالمتجر بنجاح!');
      }
      setIsProductModalOpen(false);
      onRefreshProducts(); // Reload parent catalog products
    } catch (e) {
      console.error(e);
      message.error(lang === 'EN' ? 'Failed to process product.' : 'فشلت عملية حفظ المنتج بالكتالوج.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const localProducts = JSON.parse(localStorage.getItem('mock_products') || '[]');
      const filtered = localProducts.filter(p => p.id !== productId);
      localStorage.setItem('mock_products', JSON.stringify(filtered));
      
      message.success(lang === 'EN' ? 'Product deleted successfully.' : 'تم حذف قطعة المجوهرات بنجاح.');
      onRefreshProducts();
    } catch (e) {
      console.error(e);
      message.error('Failed to delete product.');
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    try {
      const headers = ['Order Code', 'Client Name', 'Email', 'Governorate', 'Date Placed', 'Subtotal (EGP)', 'Payment Method', 'Status'];
      const rows = orders.map(o => [
        o.trackingNumber,
        `${o.client.firstName} ${o.client.lastName}`,
        o.client.email,
        o.client.city,
        o.date.split(',')[0],
        o.grandTotal,
        o.paymentMethod.toUpperCase(),
        o.status
      ]);

      let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for proper Excel Arabic rendering!
      csvContent += headers.join(",") + "\n";
      rows.forEach(row => {
        const sanitizedRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`);
        csvContent += sanitizedRow.join(",") + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `lazuli_sales_report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(lang === 'EN' ? 'Spreadsheet report downloaded successfully!' : 'تم تحميل التقرير المالي بنجاح!');
    } catch (e) {
      console.error(e);
      message.error('CSV Export failed.');
    }
  };

  // Analytics Metrics calculations
  const totalSales = useMemo(() => orders.reduce((acc, o) => acc + o.grandTotal, 0), [orders]);
  const lowStockCount = useMemo(() => allProducts.filter(p => p.stock <= 3 && p.stock > 0).length, [allProducts]);
  const activeOrdersCount = useMemo(() => orders.filter(o => o.status !== 'Delivered').length, [orders]);

  // Antd Table Column Definitions
  const productsTableColumns = [
    {
      title: lang === 'EN' ? 'Display' : 'صورة العرض',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <img src={text} className="w-10 h-12 object-cover border border-[#EAE3D9] bg-[#FAF9F6]" alt="Preview" />
    },
    {
      title: lang === 'EN' ? 'Name' : 'الاسم الفني للقطعة',
      dataIndex: 'name_en',
      key: 'name',
      sorter: (a, b) => a.name_en.localeCompare(b.name_en),
      render: (text, record) => (
        <div>
          <h4 className="font-semibold text-xs text-[#1C1A17]">{getBilingualValue(record, 'name')}</h4>
          <span className="text-[10px] text-brand-gold uppercase tracking-wider">{getBilingualValue(record, 'collection')}</span>
        </div>
      )
    },
    {
      title: lang === 'EN' ? 'Price' : 'السعر بالجنيه',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (val) => <span className="font-semibold text-xs">{val.toLocaleString()} ج.م</span>
    },
    {
      title: lang === 'EN' ? 'Stock' : 'المخزون',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => {
        if (stock === 0) return <Tag color="default">{lang === 'EN' ? 'Sold Out' : 'نفد بالكامل'}</Tag>;
        if (stock <= 3) return <Tag color="warning">{lang === 'EN' ? `Low Stock (${stock})` : `متبقي قليل (${stock})`}</Tag>;
        return <Tag color="success">{lang === 'EN' ? `In Stock (${stock})` : `متوفر (${stock})`}</Tag>;
      }
    },
    {
      title: lang === 'EN' ? 'Category' : 'الفئة الأساسية',
      dataIndex: 'category_en',
      key: 'category',
      render: (text, record) => <span className="text-xs text-[#706C66]">{getBilingualValue(record, 'category')}</span>
    },
    {
      title: lang === 'EN' ? 'Actions' : 'إجراءات الكتالوج',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<Edit size={14} className="text-blue-500" />} 
            onClick={() => handleOpenProductModal(record)} 
            className="flex items-center"
          />
          <Popconfirm
            title={lang === 'EN' ? 'Are you sure you want to delete this jewelry product?' : 'هل أنت متأكد من حذف هذه القطعة الفنية بالكامل؟'}
            onConfirm={() => handleDeleteProduct(record.id)}
            okText={lang === 'EN' ? 'Yes' : 'نعم'}
            cancelText={lang === 'EN' ? 'No' : 'لا'}
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              icon={<Trash2 size={14} className="text-red-500" />} 
              className="flex items-center"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Filter products by local search query
  const filteredProducts = useMemo(() => {
    if (!productSearch) return allProducts;
    const q = productSearch.toLowerCase();
    return allProducts.filter(p => 
      getBilingualValue(p, 'name').toLowerCase().includes(q) || 
      getBilingualValue(p, 'category').toLowerCase().includes(q) ||
      getBilingualValue(p, 'stone').toLowerCase().includes(q)
    );
  }, [allProducts, productSearch, lang]);

  return (
    <Layout className="min-h-screen bg-[#FAF9F6] text-[#1C1A17] mt-[80px]">
      
      {/* Sider Sidebar Navigation */}
      <Sider 
        width={240} 
        theme="light" 
        className="border-r border-[#EAE3D9] bg-white hidden md:block"
        style={{ position: 'sticky', top: '80px', height: 'calc(100vh - 80px)' }}
      >
        <div className="p-4 border-b border-[#EAE3D9] text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#1C1A17]">LAZULI STUDIO</h3>
          <span className="text-[9px] text-[#706C66] tracking-widest uppercase font-semibold">{t('ownerConsole')}</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenuKey]}
          onClick={({ key }) => setActiveMenuKey(key)}
          className="admin-sidebar-menu mt-4 border-none"
        >
          <Menu.Item key="dashboard" icon={<DollarSign size={16} />}>
            <span>{lang === 'EN' ? 'Dashboard Overview' : 'نظرة عامة للوحة'}</span>
          </Menu.Item>
          <Menu.Item key="products" icon={<Package size={16} />}>
            <span>{lang === 'EN' ? 'Catalog Management' : 'إدارة الكتالوج'}</span>
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCart size={16} />}>
            <span>{lang === 'EN' ? 'Incoming Orders' : 'إدارة طلبات العملاء'}</span>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content viewport */}
      <Layout className="bg-[#FAF9F6]">
        <Content className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          
          {/* Header & CSV Exporter button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-1 block">{t('ownerConsole')}</span>
              <h2 className="text-3xl font-serif font-semibold text-brand-charcoal">{t('studioDashboard')}</h2>
            </div>
            
            <Button 
              onClick={handleExportCSV}
              icon={<FileDown size={14} />}
              className="bg-[#1C1A17] text-white hover:bg-brand-gold h-10 px-4 rounded-none text-xs border-none font-semibold uppercase tracking-wider flex items-center justify-center gap-2 self-start"
            >
              {lang === 'EN' ? 'Export CSV Sales' : 'تصدير تقرير المبيعات'}
            </Button>
          </div>

          {/* DASHBOARD METRICS CARDS OVERVIEW */}
          {activeMenuKey === 'dashboard' && (
            <div className="flex flex-col gap-8">
              
              {/* Row of statistic cards */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card bordered={false} className="shadow-sm border border-[#EAE3D9]">
                    <Statistic 
                      title={t('revenue')} 
                      value={totalSales} 
                      precision={0} 
                      suffix="ج.م" 
                      valueStyle={{ color: '#D37F4B', fontWeight: 'bold' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card bordered={false} className="shadow-sm border border-[#EAE3D9]">
                    <Statistic 
                      title={lang === 'EN' ? 'Total Orders Placed' : 'إجمالي الفواتير والطلبات'} 
                      value={orders.length} 
                      valueStyle={{ color: '#1C1A17', fontWeight: 'bold' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card bordered={false} className="shadow-sm border border-[#EAE3D9]">
                    <Statistic 
                      title={t('activeOrders')} 
                      value={activeOrdersCount} 
                      valueStyle={{ color: '#C4A478', fontWeight: 'bold' }} 
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card bordered={false} className="shadow-sm border border-[#EAE3D9]">
                    <Statistic 
                      title={lang === 'EN' ? 'Low Stock Alerts' : 'تحذيرات نفاد المخزون'} 
                      value={lowStockCount} 
                      valueStyle={{ color: lowStockCount > 0 ? '#E06A6A' : '#10B981', fontWeight: 'bold' }} 
                      prefix={lowStockCount > 0 ? <AlertCircle size={18} className="mr-1 inline-block" /> : null}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Low stock alerts panel summary */}
              {lowStockCount > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex gap-3 items-center">
                  <ShieldAlert size={20} className="shrink-0 text-red-600" />
                  <span>
                    <strong>{lang === 'EN' ? 'Low Stock Alert!' : 'تحذير مخزون منخفض!'}</strong> {lang === 'EN' ? `There are ${lowStockCount} jewelry pieces currently low in stock (less than 3). Update stock parameters immediately.` : `هناك ${lowStockCount} قطع مجوهرات يقل مخزونها في الورشة عن ٣ قطع. يرجى تجديد المخزون.`}
                  </span>
                </div>
              )}

              {/* Recent Orders log lists */}
              <div className="bg-white border border-[#EAE3D9] p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1C1A17] mb-4 pb-2 border-b border-[#EAE3D9]">{lang === 'EN' ? 'Recent Order Logs' : 'سجل فواتير العملاء الأخيرة'}</h3>
                {orders.length === 0 ? (
                  <Empty description={lang === 'EN' ? 'No orders logged.' : 'لا يوجد طلبات مسجلة حالياً.'} />
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="flex justify-between items-center text-xs pb-3 border-b border-[#EAE3D9]/60">
                        <div>
                          <span className="font-mono font-bold text-brand-charcoal">{o.trackingNumber}</span>
                          <span className="text-[#706C66] mx-2">|</span>
                          <span className="font-semibold">{o.client.firstName} {o.client.lastName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-brand-copper">{o.grandTotal.toLocaleString()} ج.م</span>
                          <Tag color="orange" className="m-0 text-[10px]">{lang === 'EN' ? o.status : 'نشط'}</Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* CATALOG PRODUCT MANAGEMENT CRUD TABLE */}
          {activeMenuKey === 'products' && (
            <div className="flex flex-col gap-6 bg-white border border-[#EAE3D9] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D9]">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1C1A17]">{t('catalogItems')}</h3>
                
                <div className="flex gap-3">
                  <Input 
                    placeholder={lang === 'EN' ? 'Search catalog...' : 'ابحث في الكتالوج...'}
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-48 text-xs h-10 border-[#EAE3D9] rounded-none focus:border-brand-gold"
                  />
                  <Button 
                    type="primary" 
                    icon={<Plus size={14} />} 
                    onClick={() => handleOpenProductModal(null)}
                    className="bg-[#1C1A17] text-white hover:bg-brand-gold h-10 px-4 rounded-none text-xs border-none font-semibold uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    {lang === 'EN' ? 'Add Product' : 'إضافة منتج'}
                  </Button>
                </div>
              </div>

              {/* Advanced Antd Table with sorting, searching, pagination */}
              <Table 
                columns={productsTableColumns} 
                dataSource={filteredProducts} 
                rowKey="id"
                pagination={{ pageSize: 10, size: 'small', className: 'custom-antd-pagination' }}
                className="custom-antd-table"
              />

            </div>
          )}

          {/* INCOMING ORDERS MANAGEMENT */}
          {activeMenuKey === 'orders' && (
            <div className="flex flex-col gap-6 bg-white border border-[#EAE3D9] p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1C1A17] pb-4 border-b border-[#EAE3D9]">{t('ordersTab')}</h3>
              
              {loadingOrders ? (
                <div className="text-center py-10">
                  <Spin size="large" className="custom-spin" />
                </div>
              ) : orders.length === 0 ? (
                <Empty description={lang === 'EN' ? 'No client orders found.' : 'لم يسجل المتجر أي طلبات حتى الآن.'} />
              ) : (
                <div className="flex flex-col gap-6">
                  {orders.map(o => (
                    <div key={o.id} className="border border-[#EAE3D9] bg-[#FAF8F4]/50 p-6 flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-grow flex flex-col gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-brand-charcoal text-sm">{o.trackingNumber}</span>
                          <Tag color="orange">{lang === 'EN' ? o.status : 'قيد المراجعة'}</Tag>
                        </div>
                        <p className="font-semibold text-brand-charcoal mt-1">
                          {lang === 'EN' ? 'Client' : 'العميل'}: {o.client.firstName} {o.client.lastName} | 📞 {o.client.phone} | ✉️ {o.client.email}
                        </p>
                        <p className="text-gray-500">
                          📍 {o.client.address}, {o.client.apartment}, {getCityName(o.client.city)}
                        </p>
                        <div className="mt-2 flex flex-col gap-1 border-t border-[#EAE3D9]/60 pt-2">
                          {o.items.map((item, idx) => (
                            <span key={idx} className="text-gray-600">
                              - {getBilingualValue(item, 'name')} <strong className="text-brand-gold">x{item.quantity}</strong> ({(item.price * item.quantity).toLocaleString()} ج.م)
                            </span>
                          ))}
                        </div>
                        {o.giftMessage && (
                          <div className="mt-2 bg-orange-50 border border-orange-100 p-2 text-[10px] text-[#D37F4B]">
                            <strong>🎁 {t('giftNoteLabel')}:</strong> "{o.giftMessage}"
                          </div>
                        )}
                      </div>

                      {/* Order status dropdown actions */}
                      <div className="shrink-0 flex flex-col justify-between items-end gap-4 min-w-[200px]">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block">{lang === 'EN' ? 'Billing Sum' : 'حساب الفاتورة'}</span>
                          <strong className="text-base text-brand-copper font-bold block mt-0.5">{o.grandTotal.toLocaleString()} ج.م</strong>
                        </div>
                        
                        <div className="flex gap-2 w-full justify-end">
                          {o.status === 'Pending' && (
                            <Button 
                              onClick={() => handleUpdateOrderStatus(o.id, 'Shipped')}
                              className="bg-[#1C1A17] text-white hover:bg-brand-gold text-xs h-9 rounded-none border-none font-semibold uppercase tracking-wider w-full"
                            >
                              {t('shipBtn')}
                            </Button>
                          )}
                          {o.status === 'Shipped' && (
                            <Button 
                              onClick={() => handleUpdateOrderStatus(o.id, 'Delivered')}
                              className="bg-brand-gold text-white hover:bg-brand-gold-dark text-xs h-9 rounded-none border-none font-semibold uppercase tracking-wider w-full"
                            >
                              {t('deliverBtn')}
                            </Button>
                          )}
                          {o.status === 'Delivered' && (
                            <div className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase tracking-wider py-2">
                              <Check size={16} />
                              <span>{t('completed')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </Content>
      </Layout>

      {/* ADD / EDIT PRODUCT DRAWER FORM MODAL */}
      <Modal
        title={
          <h3 className="text-lg font-serif font-semibold border-b border-[#EAE3D9] pb-2 mb-4 text-[#1C1A17]">
            {editingProduct ? (lang === 'EN' ? 'Edit Jewelry Piece' : 'تعديل مواصفات قطعة المجوهرات') : t('sculptPiece')}
          </h3>
        }
        open={isProductModalOpen}
        onCancel={() => setIsProductModalOpen(false)}
        footer={null}
        width={720}
        className="custom-admin-modal"
      >
        <Form
          form={productForm}
          layout="vertical"
          onFinish={handleProductSubmit}
          className="text-xs text-[#1C1A17]"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name_en" 
                label={lang === 'EN' ? 'Name (EN)' : 'اسم القطعة بالإنجليزي'} 
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. Copper Turquoise Hoop" className="rounded-none h-10 border-[#EAE3D9]" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="name_ar" 
                label={lang === 'EN' ? 'Name (AR)' : 'اسم القطعة بالعربي'} 
                rules={[{ required: true }]}
              >
                <Input placeholder="مثال: قرط النحاس والفيروز" className="rounded-none h-10 border-[#EAE3D9]" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="price" 
                label={t('priceEGP')} 
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full rounded-none h-10 border-[#EAE3D9]" placeholder="1850" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="stock" 
                label={t('stockLevel')} 
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full rounded-none h-10 border-[#EAE3D9]" placeholder="10" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                name="category_en" 
                label={lang === 'EN' ? 'Category' : 'الفئة الرئيسية'} 
                rules={[{ required: true }]}
              >
                <Select className="rounded-none" dropdownClassName="custom-select-dropdown">
                  <Select.Option value="Handmade Copper">{lang === 'EN' ? 'Handmade Copper' : 'النحاس الهاند ميد'}</Select.Option>
                  <Select.Option value="Precious Stones">{lang === 'EN' ? 'Precious Stones' : 'الأحجار الكريمة الهاند ميد'}</Select.Option>
                  <Select.Option value="Gift Boxes & Bundles">{lang === 'EN' ? 'Gift Boxes & Bundles' : 'الهدايا والبوكسات'}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="subcategory_en" 
                label={lang === 'EN' ? 'Subcategory' : 'قسم فرعي'} 
                rules={[{ required: true }]}
              >
                <Select className="rounded-none" dropdownClassName="custom-select-dropdown">
                  <Select.Option value="Earrings">{t('earrings')}</Select.Option>
                  <Select.Option value="Necklaces">{t('necklaces')}</Select.Option>
                  <Select.Option value="Bracelets">{t('bracelets')}</Select.Option>
                  <Select.Option value="Rings">{t('rings')}</Select.Option>
                  <Select.Option value="Pins">{t('pins')}</Select.Option>
                  <Select.Option value="Gift Sets">{lang === 'EN' ? 'Gift Sets' : 'علب هدايا'}</Select.Option>
                  <Select.Option value="Bundles">{lang === 'EN' ? 'Bundles' : 'مجموعات هدايا'}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="collection_en" 
                label={lang === 'EN' ? 'Collection' : 'المجموعة الفنية'} 
                rules={[{ required: true }]}
              >
                <Select className="rounded-none" dropdownClassName="custom-select-dropdown">
                  <Select.Option value="Nature's Mosaic">{lang === 'EN' ? "Nature's Mosaic" : "فسيفساء الطبيعة"}</Select.Option>
                  <Select.Option value="El Kawthar">{lang === 'EN' ? "El Kawthar" : "الكوثر"}</Select.Option>
                  <Select.Option value="Oumy">{lang === 'EN' ? "Oumy" : "أمي"}</Select.Option>
                  <Select.Option value="Calligraphy">{lang === 'EN' ? "Calligraphy" : "الخط العربي"}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="stone_en" 
                label={t('gemStone')} 
                rules={[{ required: true }]}
              >
                <Select className="rounded-none" dropdownClassName="custom-select-dropdown">
                  <Select.Option value="None">{lang === 'EN' ? 'None' : 'بدون حجر'}</Select.Option>
                  <Select.Option value="Lapis Lazuli">{lang === 'EN' ? 'Lapis Lazuli' : 'لازورد'}</Select.Option>
                  <Select.Option value="Turquoise">{lang === 'EN' ? 'Turquoise' : 'فيروز'}</Select.Option>
                  <Select.Option value="Amethyst">{lang === 'EN' ? 'Amethyst' : 'جمشت/أميثيست'}</Select.Option>
                  <Select.Option value="Malachite">{lang === 'EN' ? 'Malachite' : 'مالاشيت'}</Select.Option>
                  <Select.Option value="Beige Agate">{lang === 'EN' ? 'Beige Agate' : 'عقيق بيج'}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="material_en" 
                label={lang === 'EN' ? 'Material Details' : 'مواصفات المعادن'} 
                rules={[{ required: true }]}
              >
                <Select className="rounded-none" dropdownClassName="custom-select-dropdown">
                  <Select.Option value="Pure Copper">{lang === 'EN' ? 'Pure Hand-hammered Copper' : 'نحاس نقي مطروق باليد'}</Select.Option>
                  <Select.Option value="18k Gold Plated Brass">{lang === 'EN' ? '18k Gold Plated Brass' : 'نحاس مطلي بذهب عيار 18'}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="image" 
            label={t('imagePrimary')} 
            rules={[{ required: true, type: 'url' }]}
          >
            <Input className="rounded-none h-10 border-[#EAE3D9]" placeholder="https://images.unsplash.com/photo..." />
          </Form.Item>

          <Form.Item 
            name="hoverImage" 
            label={t('imageHover')} 
            rules={[{ type: 'url' }]}
          >
            <Input className="rounded-none h-10 border-[#EAE3D9]" placeholder="https://images.unsplash.com/photo..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="description_en" 
                label={lang === 'EN' ? 'Editorial Description (EN)' : 'الوصف الفني بالإنجليزي'} 
                rules={[{ required: true }]}
              >
                <Input.TextArea className="rounded-none border-[#EAE3D9]" rows={3} placeholder="Tell the heritage story of this accessory..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="description_ar" 
                label={lang === 'EN' ? 'Editorial Description (AR)' : 'الوصف الفني بالعربي'} 
                rules={[{ required: true }]}
              >
                <Input.TextArea className="rounded-none border-[#EAE3D9]" rows={3} placeholder="قصة الحرفة التراثية وإلهام الأحجار الطبيعية لهذه القطعة..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="details_en_str" 
                label={lang === 'EN' ? 'Bullet Specs (EN - Separate with comma)' : 'المواصفات نقطية بالإنجليزي (افصل بفاصلة)'}
              >
                <Input className="rounded-none h-10 border-[#EAE3D9]" placeholder="e.g. 100% pure copper, drop length 4cm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="details_ar_str" 
                label={lang === 'EN' ? 'Bullet Specs (AR - Separate with comma)' : 'المواصفات نقطية بالعربي (افصل بفاصلة)'}
              >
                <Input className="rounded-none h-10 border-[#EAE3D9]" placeholder="مثال: نحاس مصري نقي ١٠٠٪، طول القرط ٤ سم" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex gap-4 mt-6 justify-end">
            <Button 
              onClick={() => setIsProductModalOpen(false)}
              className="border-[#EAE3D9] text-[#706C66] hover:bg-gray-100 rounded-none h-10 text-xs font-semibold uppercase tracking-wider"
            >
              {lang === 'EN' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button 
              htmlType="submit"
              type="primary"
              className="bg-[#1C1A17] text-white hover:bg-brand-gold rounded-none h-10 text-xs font-bold uppercase tracking-widest border-none"
            >
              {lang === 'EN' ? 'Save Piece' : 'حفظ ونشر القطعة'}
            </Button>
          </div>
        </Form>
      </Modal>

      <style>{`
        /* Overwrite Ant Design Sider, Tables, Paginations for luxury geometric styling */
        .admin-sidebar-menu .ant-menu-item-selected {
          background-color: #FAF5EE !important;
          color: var(--gold-primary) !important;
          font-weight: 600;
        }

        .admin-sidebar-menu .ant-menu-item:hover {
          color: var(--gold-primary) !important;
        }

        .custom-antd-table .ant-table-thead > tr > th {
          background: #FAF8F4 !important;
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: var(--text-secondary);
          border-bottom: 2px solid var(--border-color) !important;
        }

        .custom-antd-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid var(--border-color) !important;
        }

        .custom-antd-pagination .ant-pagination-item-active {
          border-color: var(--gold-primary) !important;
          background: var(--gold-primary) !important;
        }

        .custom-antd-pagination .ant-pagination-item-active a {
          color: #FFFFFF !important;
        }

        .custom-antd-pagination .ant-pagination-item:hover {
          border-color: var(--gold-primary) !important;
        }

        .custom-antd-pagination .ant-pagination-item:hover a {
          color: var(--gold-primary) !important;
        }

        .custom-admin-modal .ant-modal-content {
          border-radius: 0 !important;
          background-color: #FAF9F6;
        }
      `}</style>
    </Layout>
  );
}
