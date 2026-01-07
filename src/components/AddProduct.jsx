import React from 'react'

const AddProduct = ({onAddProduct}) => {
  return (
     <button
        onClick={onAddProduct}
        className="mt-6 px-4 py-2 border-2 border-teal-600 text-teal-600 rounded hover:bg-teal-50"
      >
        Add Product
      </button>
  )
}

export default AddProduct