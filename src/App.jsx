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
      { "id": 65, "product_id": 80, "title": "S / Silver", "price": "49" },
      { "id": 66, "product_id": 80, "title": "M / Silver", "price": "49" }
    ],
    "image": {
      "id": 272,
      "product_id": 80,
      "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1"
    }
  },
  {
    "id": 81,
    "title": "Handcrafted Ceramic Mug – Ocean Blue",
    "variants": [
      { "id": 67, "product_id": 81, "title": "12 oz / Glossy", "price": "34" },
      { "id": 68, "product_id": 81, "title": "16 oz / Matte", "price": "38" },
      { "id": 69, "product_id": 81, "title": "20 oz / Matte", "price": "42" }
    ],
    "image": {
      "id": 273,
      "product_id": 81,
      "src": "https://example.com/images/ceramic-mug-ocean-blue.jpg"
    }
  },
  {
    "id": 82,
    "title": "Organic Cotton Throw Blanket – Charcoal",
    "variants": [
      { "id": 70, "product_id": 82, "title": "50×60 in", "price": "89" },
      { "id": 71, "product_id": 82, "title": "60×80 in", "price": "119" }
    ],
    "image": {
      "id": 274,
      "product_id": 82,
      "src": "https://example.com/images/organic-cotton-throw-charcoal.jpg"
    }
  },
  {
    "id": 83,
    "title": "Minimalist Walnut Desk Lamp",
    "variants": [
      { "id": 72, "product_id": 83, "title": "Standard / Warm Light", "price": "129" },
      { "id": 73, "product_id": 83, "title": "Standard / Cool Light", "price": "129" }
    ],
    "image": {
      "id": 275,
      "product_id": 83,
      "src": "https://example.com/images/walnut-desk-lamp.jpg"
    }
  },
  {
    "id": 84,
    "title": "Bamboo Cutting Board Set – 3 Pieces",
    "variants": [
      { "id": 74, "product_id": 84, "title": "Small / Medium / Large", "price": "59" }
    ],
    "image": {
      "id": 276,
      "product_id": 84,
      "src": "https://example.com/images/bamboo-cutting-board-set.jpg"
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
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Map());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const pickerScrollRef = useRef(null);
  const dragCounter = useRef(0);

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
      setAvailableProducts(dummyAvailableProducts)
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

  const handleDragStart = (e, index, variantIndex = null) => {
    setDraggedItem({ index, variantIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    e.currentTarget.style.borderTop = '2px solid #0d9488';
  };

  const handleDragLeave = (e) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      e.currentTarget.style.borderTop = '';
    }
  };

  const handleDrop = (e, dropIndex, dropVariantIndex = null) => {
    e.preventDefault();
    e.currentTarget.style.borderTop = '';
    dragCounter.current = 0;
    
    if (!draggedItem) return;

    const updated = [...products];
    
    if (draggedItem.variantIndex !== null && dropVariantIndex !== null && draggedItem.index === dropIndex) {
      const variants = [...updated[dropIndex].variants];
      const [removed] = variants.splice(draggedItem.variantIndex, 1);
      variants.splice(dropVariantIndex, 0, removed);
      updated[dropIndex].variants = variants;
    } else if (draggedItem.variantIndex === null && dropVariantIndex === null) {
      const [removed] = updated.splice(draggedItem.index, 1);
      updated.splice(dropIndex, 0, removed);
    }
    
    setProducts(updated);
    setDraggedItem(null);
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
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        draggedItem={draggedItem}
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
