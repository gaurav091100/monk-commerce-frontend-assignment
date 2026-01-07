import { X, Edit2 } from 'lucide-react';
import AddProduct from './AddProduct';

const ProductList = ({ products, onAddProduct, onEditProduct, onRemoveProduct, onToggleVariants, onUpdateDiscount }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add Products</h1>

      <div className="space-y-4">
        <div className="flex items-start gap-4 pb-2 border-b border-gray-200">
          <div className="flex-1 font-medium text-sm">Product</div>
          <div className="w-64 font-medium text-sm">Discount</div>
        </div>

        {products.map((item, index) => (
          <div key={item.id} className="space-y-2" >
            <div
              className="flex items-start gap-4 transition-opacity"
            >
              <div className="flex items-center gap-2 cursor-move">
                <span className="text-sm font-medium">{index + 1}.</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 p-2 border border-gray-300 rounded bg-white">
                  {item.product ? (
                    <>
                      <img
                        src={item.product.image?.src || ''}
                        alt={item.product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="text-sm flex-1">{item.product.title}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 flex-1">Select Product</span>
                  )}
                  <button
                    onClick={() => onEditProduct(index)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-64">
                {item.discount.value ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={item.discount.value}
                      onChange={(e) => onUpdateDiscount(index, 'value', e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="0"
                    />
                    <select
                      value={item.discount.type}
                      onChange={(e) => onUpdateDiscount(index, 'type', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="percentage">% Off</option>
                      <option value="flat">flat off</option>
                    </select>
                  </div>
                ) : (
                  <button
                    onClick={() => onUpdateDiscount(index, 'value', '0')}
                    className="w-full px-4 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700"
                  >
                    Add Discount
                  </button>
                )}
              </div>

              {products.length > 1 && (
                <button
                  onClick={() => onRemoveProduct(index)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {item.variants.length > 1 && (
              <div className="ml-12">
                <button
                  onClick={() => onToggleVariants(index)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {item.showVariants ? (
                    <>Hide Variants <span className="text-xs">▲</span></>
                  ) : (
                    <>Show Variants <span className="text-xs">▼</span></>
                  )}
                </button>
              </div>
            )}

            {item.showVariants && item.variants.map((variant, vIndex) => (
              <div
                key={variant.id}
                className="flex items-center gap-4 ml-12 transition-opacity"
              >

                <div className="flex-1">
                  <div className="p-2 border border-gray-300 rounded text-sm bg-white">
                    {variant.title}
                  </div>
                </div>

                <div className="w-64">
                  {variant.discount.value ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={variant.discount.value}
                        onChange={(e) => onUpdateDiscount(index, 'value', e.target.value, vIndex)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="0"
                      />
                      <select
                        value={variant.discount.type}
                        onChange={(e) => onUpdateDiscount(index, 'type', e.target.value, vIndex)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="percentage">% Off</option>
                        <option value="flat">flat off</option>
                      </select>
                    </div>
                  ) : (
                    <button
                      onClick={() => onUpdateDiscount(index, 'value', '0', vIndex)}
                      className="w-full px-4 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700"
                    >
                      Add Discount
                    </button>
                  )}
                </div>

                <div className="w-6"></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <AddProduct onAddProduct={onAddProduct} />
    </div>
  );
};

export default ProductList;



