export default class PriorityQueue{
  
    constructor(inArray, compareProperty) {
      this.heap = [...inArray];
      this.compareProperty = compareProperty;
      this.len = this.heap.length;
      const start = Math.floor((this.len - 2) / 2);
  
      for (let i = start; i >= 0; i--) {
        this.minHeapify(i);
      }
    }
  
    minHeapify(indx) {
      const l_c = 2 * indx + 1;
      const r_c = 2 * indx + 2;
      let indx_smallest = indx;
  
      if (this.compareProperty) {
        if (l_c < this.len && this.heap[l_c][this.compareProperty] < this.heap[indx][this.compareProperty]) {
          indx_smallest = l_c;
        }
  
        if (r_c < this.len && this.heap[r_c][this.compareProperty] < this.heap[indx_smallest][this.compareProperty]) {
          indx_smallest = r_c;
        }
      } else {
        if (l_c < this.len && this.heap[l_c] < this.heap[indx]) {
          indx_smallest = l_c;
        }
  
        if (r_c < this.len && this.heap[r_c] < this.heap[indx_smallest]) {
          indx_smallest = r_c;
        }
      }
  
      if (indx !== indx_smallest) {
        let temp = this.heap[indx];
        this.heap[indx] = this.heap[indx_smallest];
        this.heap[indx_smallest] = temp;
  
        this.minHeapify(indx_smallest);
      }
    }
  
    insert(elm){
  
      this.heap.push(elm);
      this.len += 1;
  
      let indx = Math.floor((this.len - 1) / 2);
  
      while (indx >= 0) {
        this.minHeapify(indx);
  
        if (indx === 0) {
          break;
        }
        indx = Math.floor((indx - 1) / 2);
      }
    }
  
    min_elm() {
      return this.heap[0];
    }
  
    extractMin() {
      if (this.len === 0) {
        return undefined;
      }
  
      let minimum_elm = this.heap[0];
      this.heap[0] = this.heap[this.len - 1];
  
      this.heap.pop();
      this.len -= 1;
  
      this.minHeapify(0);
  
      return minimum_elm;
    }
  }
