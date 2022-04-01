import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { Food } from '../../components/Food';

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

type FoodInput = Omit<FoodProps, "id" | "available">;

export function Dashboard() {

  const [ modalOpen, setModalOpen ] = useState(false);
  const [ editModalOpen, setEditModalOpen ] = useState(false);
  const [ foods, setFoods ] = useState<FoodProps[]>([]);
  const [ editingFood, setEditingFood ] = useState<FoodProps>({} as FoodProps);

  useEffect(() => {
    api.get("/foods")
    .then(response => setFoods(response.data))
}, []);
  

  async function handleAddFood (food: FoodInput) {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      });

      const updatedFoods = [...foods, response.data]

      setFoods(updatedFoods);

    } catch (err) {
      console.log(err);
    }
  };

  async function handleUpdateFood (food: FoodInput) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data,
      );

      setFoods(foodsUpdated);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);

  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);

  }

  const toggleEditModal = () => {

    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodProps) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};
