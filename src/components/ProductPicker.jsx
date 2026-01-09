import { Search, X } from "lucide-react";

const ProductPicker = ({ 
  isOpen, 
  onClose, 
  availableProducts, 
  selectedProducts, 
  onProductSelect, 
  onVariantSelect, 
  onAddProducts,
  onSearch,
  searchQuery,
  loading,
  onScroll,
  pickerScrollRef
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Products</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search product"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div 
          ref={pickerScrollRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-4"
        >
          {availableProducts.map((product) => {
            const isProductSelected = selectedProducts.has(product.id);
            const selectedProduct = selectedProducts.get(product.id);
            
            return (
              <div key={product.id} className="mb-4 border-b pb-4">
                <div className="flex items-start gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={isProductSelected}
                    onChange={() => onProductSelect(product)}
                    className="mt-1 w-4 h-4"
                  />
                  <img 
                    src={product.image?.src || ''} 
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.title}</div>
                  </div>
                </div>

                {product.variants.length > 0 && (
                  <div className="ml-9 space-y-2">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedProduct?.selectedVariants.has(variant.id) || false}
                          onChange={() => onVariantSelect(product.id, variant.id)}
                          className="w-4 h-4"
                        />
                        <span className="flex-1">{variant.title}</span>
                        <span className="text-gray-500">{variant.price ? `${variant.price} available` : ''}</span>
                        <span className="text-gray-700 font-medium">${variant.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {loading && <div className="text-center py-4">Loading...</div>}
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <span className="text-sm">
            {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              disabled={selectedProducts.size === 0}
              onClick={onAddProducts}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;