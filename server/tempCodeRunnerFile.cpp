#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

long long maximumSubarraySum(vector<int>& nums, int k) {
    
    long long ans = 0;
    for(int i = 0; i<nums.size()-k+1; i++){
        long long sum = 0;
        vector<int> temp;
        for(int j = i; j<i+k; j++){
            temp.push_back(nums[j]);
            sum += nums[j];
        }
        // for(int j = 0; j<temp.size(); j++){
        //     cout<<temp[j]<<" ";
        // }
        // cout<<endl;
        sort(temp.begin(), temp.end());
        bool flag = false;
        for(int j = 0; j<k; j++){
            if(temp[j] == temp[j+1]){
                flag = true;
                break;
            }
        }
        if(flag)
            continue;
        if(sum > ans)
            ans = sum;
    }
    return ans;
}

int main() {
    vector<int> nums = {1,5,4,2,9,9,9};
    cout<<maximumSubarraySum(nums, 3);
}
