'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, ShoppingCart, ChefHat, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MealPlanPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mealPlan, setMealPlan] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'plan' | 'shopping'>('plan');

    const generatePlan = async () => {
        console.log('Generate plan clicked. Session:', session, 'Status:', status);
        setError(null);

        if (!session?.user?.id) {
            setError('You must be logged in to generate a meal plan.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/meal-plan/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.user.id,
                    weekStartDate: new Date().toISOString(),
                    totalBudget: 150, // Default budget, can be made dynamic later
                    nutritionGoals: {
                        dailyCalories: 2000,
                        proteinGrams: 150,
                        carbsGrams: 200,
                        fatGrams: 65,
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate meal plan');
            }

            if (data.success) {
                setMealPlan(data.data);
            } else {
                setError(data.error || 'Failed to generate meal plan');
            }
        } catch (error) {
            console.error('Failed to generate meal plan:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-clash text-charcoal-blue">Weekly Meal Plan</h1>
                    <p className="text-gray-500 mt-2">AI-optimized for your budget and inventory</p>
                </div>
                <button
                    onClick={generatePlan}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-sage-green text-white px-6 py-3 rounded-xl hover:bg-deep-emerald transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                    Generate New Plan
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {mealPlan ? (
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('plan')}
                            className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'plan' ? 'text-sage-green' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Calendar size={18} /> Meal Plan
                            </span>
                            {activeTab === 'plan' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-green"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('shopping')}
                            className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'shopping' ? 'text-sage-green' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <ShoppingCart size={18} /> Shopping List
                            </span>
                            {activeTab === 'shopping' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-green"
                                />
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === 'plan' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mealPlan.meals.map((meal: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-stone-100 text-charcoal-blue px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            Day {meal.dayOfWeek + 1} • {meal.mealType}
                                        </span>
                                        <span className="text-sage-green font-bold">${meal.estimatedCost.toFixed(2)}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-charcoal-blue mb-2">{meal.recipeName}</h3>

                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Ingredients</h4>
                                            <ul className="text-sm space-y-1">
                                                {meal.ingredients.map((ing: any, i: number) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${ing.fromInventory ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                        <span className={ing.fromInventory ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                                            {ing.quantity} {ing.unit} {ing.name}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Instructions</h4>
                                            <p className="text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                                                {meal.instructions}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-charcoal-blue">Shopping List</h2>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Estimated Cost</p>
                                    <p className="text-2xl font-bold text-sage-green">${mealPlan.estimatedCost.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {['produce', 'protein', 'dairy', 'grains', 'other'].map((category) => {
                                    const items = mealPlan.shoppingList.filter((item: any) => item.category === category);
                                    if (items.length === 0) return null;

                                    return (
                                        <div key={category}>
                                            <h3 className="text-lg font-bold capitalize mb-4 text-charcoal-blue border-b border-gray-100 pb-2">
                                                {category}
                                            </h3>
                                            <ul className="space-y-3">
                                                {items.map((item: any, i: number) => (
                                                    <li key={i} className="flex justify-between items-center group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-5 h-5 rounded border border-gray-300 group-hover:border-sage-green transition-colors" />
                                                            <span className="text-gray-700">{item.name}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-sm font-medium text-gray-900">{item.quantity} {item.unit}</span>
                                                            <span className="block text-xs text-gray-400">${item.estimatedCost.toFixed(2)}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ChefHat className="w-10 h-10 text-sage-green" />
                    </div>
                    <h2 className="text-xl font-bold text-charcoal-blue mb-2">No Meal Plan Yet</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Generate your first AI-powered meal plan based on your inventory and budget preferences.
                    </p>
                    <button
                        onClick={generatePlan}
                        disabled={isLoading}
                        className="bg-sage-green text-white px-8 py-3 rounded-xl hover:bg-deep-emerald transition-colors shadow-lg shadow-sage-green/20"
                    >
                        Generate First Plan
                    </button>
                </div>
            )}
        </div>
    );
}
