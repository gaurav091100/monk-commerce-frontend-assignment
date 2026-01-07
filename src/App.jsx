import { useRef, useState } from "react";
import ProductList from "./components/ProductList";
import ProductPicker from "./components/ProductPicker";

const API_KEY = import.meta.env.VITE_MONK_API_KEY;
const API_BASE_URL = import.meta.env.VITE_MONK_API_BASE_URL;


const dummyAvailableProducts = [
    {
      "id": 77,
      "title": "Fog Linen Chambray Towel - Beige Stripe",
      "variants": [
        { "id": 1, "product_id": 77, "title": "XS / Silver", "price": "49" },
        { "id": 2, "product_id": 77, "title": "S / Silver", "price": "49" },
        { "id": 3, "product_id": 77, "title": "M / Silver", "price": "49" }
      ],
      "image": {
        "id": 266,
        "product_id": 77,
        "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1"
      }
    },
    {
      "id": 80,
      "title": "Orbit Terrarium - Large",
      "variants": [
        { "id": 64, "product_id": 80, "title": "Default Title", "price": "109" },
        { "id": 2, "product_id": 77, "title": "S / Silver", "price": "49" },
        { "id": 3, "product_id": 77, "title": "M / Silver", "price": "49" }
      ],
      "image": {
        "id": 272,
        "product_id": 80,
        "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1"
      }
    }
  ];

  const initialProducts = [
    { id: `product-${Date.now()}`, product: null, variants: [], showVariants: false, discount: { type: 'percentage', value: '' } }
  ]
const App = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableProducts, setAvailableProducts] = useState(dummyAvailableProducts);
  const [selectedProducts, setSelectedProducts] = useState(new Map());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pickerScrollRef = useRef(null);

  const fetchProducts = async (searchTerm = '', pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}?search=${searchTerm}&page=${pageNum}&limit=10`,
        {
          headers: {
            'x-api-key': API_KEY
          }
        }
      );
      const data = await response.json();
      
      if (append) {
        setAvailableProducts(prev => [...prev, ...data]);
      } else {
        setAvailableProducts(data);
      }
      
      setHasMore(data.length === 10);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    if (!pickerScrollRef.current || loading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = pickerScrollRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(searchQuery, nextPage, true);
    }
  };

  const openPicker = (index) => {
    setEditingIndex(index);
    setIsPickerOpen(true);
    setSearchQuery('');
    setPage(1);
    
    const currentProduct = products[index];
    const preSelected = new Map();
    
    if (currentProduct.product) {
      const selectedVariantIds = new Set(
        currentProduct.variants.map(v => v.originalId || v.id)
      );
      preSelected.set(currentProduct.product.id, {
        ...currentProduct.product,
        selectedVariants: selectedVariantIds
      });
    }
    
    setSelectedProducts(preSelected);
    fetchProducts('', 1, false);
  };

  const handleProductSelect = (product) => {
    const newSelected = new Map(selectedProducts);
    const isCurrentlySelected = newSelected.has(product.id);
    
    if (isCurrentlySelected) {
      newSelected.delete(product.id);
    } else {
      const allVariantIds = new Set(product.variants.map(v => v.id));
      newSelected.set(product.id, { ...product, selectedVariants: allVariantIds });
    }
    setSelectedProducts(newSelected);
  };

  const handleVariantSelect = (productId, variantId) => {
    const newSelected = new Map(selectedProducts);
    let product = newSelected.get(productId);
    
    if (!product) {
      const fullProduct = availableProducts.find(p => p.id === productId);
      product = { ...fullProduct, selectedVariants: new Set([variantId]) };
      newSelected.set(productId, product);
    } else {
      const newVariants = new Set(product.selectedVariants);
      if (newVariants.has(variantId)) {
        newVariants.delete(variantId);
        if (newVariants.size === 0) {
          newSelected.delete(productId);
        } else {
          product.selectedVariants = newVariants;
        }
      } else {
        newVariants.add(variantId);
        product.selectedVariants = newVariants;
      }
    }
    setSelectedProducts(newSelected);
  };

  const handleAddProducts = () => {
    const newProducts = [];
    
    selectedProducts.forEach((selectedProduct) => {
      const product = availableProducts.find(p => p.id === selectedProduct.id);
      if (!product) return;

      const selectedVariantsList = product.variants.filter(v => 
        selectedProduct.selectedVariants.has(v.id)
      );
      
      newProducts.push({
        id: `product-${Date.now()}-${Math.random()}`,
        product: product,
        variants: selectedVariantsList.map((v, idx) => ({
          ...v,
          originalId: v.id,
          id: `variant-${v.id}-${idx}-${Math.random()}`,
          discount: { type: 'percentage', value: '' }
        })),
        showVariants: selectedVariantsList.length > 1,
        discount: { type: 'percentage', value: '' }
      });
    });

    const updatedProducts = [...products];
    updatedProducts.splice(editingIndex, 1, ...newProducts);
    setProducts(updatedProducts);
    setIsPickerOpen(false);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
    fetchProducts(value, 1, false);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { id: `product-${Date.now()}`, product: null, variants: [], showVariants: false, discount: { type: 'percentage', value: '' } }
    ]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const toggleVariants = (index) => {
    const updated = [...products];
    updated[index].showVariants = !updated[index].showVariants;
    setProducts(updated);
  };

  const updateDiscount = (index, field, value, variantIndex = null) => {
    const updated = [...products];
    if (variantIndex !== null) {
      updated[index].variants[variantIndex].discount[field] = value;
    } else {
      updated[index].discount[field] = value;
    }
    setProducts(updated);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <ProductList
        products={products}
        onAddProduct={addProduct}
        onEditProduct={openPicker}
        onRemoveProduct={removeProduct}
        onToggleVariants={toggleVariants}
        onUpdateDiscount={updateDiscount}
      />

      <ProductPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        availableProducts={availableProducts}
        selectedProducts={selectedProducts}
        onProductSelect={handleProductSelect}
        onVariantSelect={handleVariantSelect}
        onAddProducts={handleAddProducts}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        loading={loading}
        onScroll={handleScroll}
        pickerScrollRef={pickerScrollRef}
      />
    </div>
  );
};

export default App;