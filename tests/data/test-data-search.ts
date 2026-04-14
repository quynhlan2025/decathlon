// test-data.ts
export interface SearchTestData {
    description: string;
    keyword: string;
    expectedMessage?: string; // Dấu ? nghĩa là có thể có hoặc không
  }
  
  export const searchData: SearchTestData[] = [
    {
      description: "Search hợp lệ với sản phẩm cụ thể",
      keyword: "yoga match",
    },
    {
      description: "Search với khoảng trắng thừa",
      keyword: " shose   ",
    },
    {
      description: "Search từ khóa không tồn tại",
      keyword: "nonexistent_item_999",
      expectedMessage: "Không tìm thấy kết quả",
    }
  ];