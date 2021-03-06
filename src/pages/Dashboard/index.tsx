import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodType, AddFoodType } from "../../types/Food";


const Dashboard = (): JSX.Element => {
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  useEffect(()=>{
    async function loadFoods(){

      const response = await api.get<FoodType[]>('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []) 

 async function handleAddFood (food: AddFoodType){

    try {
      const response = await api.post<FoodType>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodType){
    try {
      if(!editingFood){
        return
      }
      const foodUpdated = await api.put<FoodType>(
        `/foods/${editingFood.id}`,
        {...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number){

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

 
  function toggleModal(): void {
    setModalOpen(!modalOpen)
  }
  

  function toggleEditModal(): void  {
    setEditModalOpen(!editModalOpen)
  }

   function handleEditFood(food: FoodType) {
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
        editingFood={editingFood as FoodType}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleEditFood={handleEditFood}
              handleDelete={handleDeleteFood}
            />
          ))}
      </FoodsContainer>
    </>
  );


}


export default Dashboard;
