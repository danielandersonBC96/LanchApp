import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/frontend_assets/assets"; // Certifique-se de que as listas de alimentos estão corretamente exportadas

// Preços dos acompanhamentos (definidos no código)
const acompanhamento_principal = [
  { name: "Vinagrete", preco: 2.5 },
  { name: "Vatapá", preco: 3 },
  { name: "Maionese", preco: 2.8 },
  { name: "Farofa", preco: 2 },
];

const acompanhamento_refri = [
  { name: "Refrigerante 300 ml", preco: 3 },
  { name: "Refrigerante 1l", preco: 5 },
  { name: "Refrigerante 2l", preco: 7 },
];

const acompanhamento_arroz = [
  { name: "Arroz Branco", preco: 4 },
  { name: "Arroz com brócolis", preco: 5 },
  { name: "Arroz Carreteiro", preco: 6 },
  { name: "Arroz Tropeiro", preco: 5.5 },
];

const acompanhamento_batata = [
  { name: "Batata média 1 pessoa", preco: 3.5 },
  { name: "Batata grande 2 pessoas", preco: 6.5 },
  { name: "Batata família", preco: 8.5 },
];

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // Inicializa o estado do carrinho
  const [cartItems, setCartItems] = useState([]);

  // Função para adicionar ao carrinho
  const addToCart = (cartItem) => {
    const existingItemIndex = cartItems.findIndex(item => item.product._id === cartItem.id);

    if (existingItemIndex !== -1) {
      // Se já existir no carrinho, apenas atualize os dados (quantidade e acompanhamentos)
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      updatedCartItems[existingItemIndex].acompanhamentos = cartItem.extras;
      setCartItems(updatedCartItems); // Atualiza o estado com os itens modificados
    } else {
      // Se não existir, adicione o item novo ao carrinho
      setCartItems(prev => [
        ...prev,
        {
          product: cartItem,
          quantity: 1,
          acompanhamentos: cartItem.extras,
        },
      ]);
    }
  };

  // Função para remover do carrinho
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.product._id === itemId);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...prev];
        const item = updatedCartItems[existingItemIndex];

        if (item.quantity === 1) {
          // Remove o item do carrinho se a quantidade for 1
          updatedCartItems.splice(existingItemIndex, 1);
        } else {
          // Decrementa a quantidade se for maior que 1
          updatedCartItems[existingItemIndex].quantity -= 1;
        }

        return updatedCartItems;
      }

      return prev;
    });
  };

  // Função para calcular o preço de acompanhamento
  const getAcompanhamentoPrice = (acomp) => {
    const allAcompanhamentos = [
      ...acompanhamento_principal,
      ...acompanhamento_refri,
      ...acompanhamento_arroz,
      ...acompanhamento_batata,
    ];

    const selectedAcompanhamento = allAcompanhamentos.find(
      (a) => a.name === acomp.name // Encontrar o acompanhamento com base no nome
    );
    return selectedAcompanhamento ? selectedAcompanhamento.preco : 0;
  };

  // Função para calcular o total do carrinho
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    let acompanhamentoTotal = 0;

    cartItems.forEach((item) => {
      // Calcula o total do produto principal
      totalAmount += item.product.price * item.quantity;

      // Adiciona o preço dos acompanhamentos
      item.acompanhamentos.forEach((acomp) => {
        acompanhamentoTotal += getAcompanhamentoPrice(acomp) * item.quantity; // Multiplicamos pelo número de unidades do item
      });
    });

    console.log("Total do Produto:", totalAmount); // Verifique o total do produto
    console.log("Total dos Acompanhamentos:", acompanhamentoTotal); // Verifique o total dos acompanhamentos
    return totalAmount + acompanhamentoTotal; // Retorna a soma de ambos
  };

  // UseEffect para verificar quando o carrinho mudar
  useEffect(() => {
    console.log('Cart Items Changed:', cartItems); // Verifique o estado do carrinho sempre que ele mudar
  }, [cartItems]);

  // Contexto com todas as funções e valores
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount, // Usando nome correto da função
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
