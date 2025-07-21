import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { backProject } from '../../services/projectService';
import { X, Gift } from 'lucide-react';

const ContributionModal = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [amount, setAmount] = useState(25);
  const [selectedReward, setSelectedReward] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleContribute = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const backer = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        amount,
        rewardId: selectedReward?.id,
        backedAt: new Date(),
      };

      await backProject(project.id, backer, amount);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error backing project:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableRewards = project.rewards.filter(reward => reward.amount <= amount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Back this project</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Rewards Selection */}
          {availableRewards.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose a reward (optional)
              </label>
              <div className="space-y-3">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedReward === null
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedReward(null)}
                >
                  <div className="font-medium text-gray-900">No reward</div>
                  <div className="text-sm text-gray-600">
                    Just support the project without expecting anything in return
                  </div>
                </div>

                {availableRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedReward?.id === reward.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedReward(reward)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Gift className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{reward.title}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{reward.description}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          Estimated delivery: {new Date(reward.estimatedDelivery).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        ${reward.amount}+
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Your contribution</span>
              <span className="text-lg font-bold text-gray-900">${amount}</span>
            </div>
            {selectedReward && (
              <div className="text-sm text-gray-600 mt-1">
                Including reward: {selectedReward.title}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContribute}
            disabled={loading || amount < 1}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Contributing...' : `Contribute $${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributionModal;