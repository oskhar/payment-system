<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-alert
          v-if="transactions.length === 0"
          type="info"
          class="mt-4"
        >
          No transaction history available.
        </v-alert>
        <v-col
          v-for="transaction in transactions"
          :key="transaction.id"
          cols="12"
        >
          <v-card
            class="mb-1"
            outlined
          >
            <v-card-title class="d-flex justify-space-between">
              <div>
                <div class="text-h6">{{ transaction.transaction_number }}</div>
                <div class="text-subtitle-2">{{ transaction.payment_method }}</div>
              </div>
              <v-btn
                icon
                color="error"
                @click="confirmDelete(transaction.id)"
              >
                <v-icon>ri-delete-bin-line</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text>
              {{ transaction.balance }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'TransactionHistory',
  data() {
    return {
      transactions: [],
    }
  },
  methods: {
    async fetchTransactions() {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transaction`)
        console.log(data.data)
        this.transactions = data.data.transactions
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      }
    },
    async confirmDelete(transactionId) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This transaction will be permanently deleted!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      })

      if (result.isConfirmed) {
        this.deleteTransaction(transactionId)
      }
    },
    async deleteTransaction(id) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/transaction`, {
          data: { id: [id] },
        })
        this.transactions = this.transactions.filter(t => t.id !== id)
        Swal.fire('Deleted!', 'Transaction has been deleted.', 'success')
      } catch (error) {
        console.error('Failed to delete transaction:', error)
        Swal.fire('Error!', 'Failed to delete transaction.', 'error')
      }
    },
  },
  mounted() {
    this.fetchTransactions()
  },
}
</script>

<style scoped>
.v-card-title {
  align-items: center;
}
</style>
