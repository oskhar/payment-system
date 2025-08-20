<script setup lang="ts">
import Swal from 'sweetalert2'
import api from '@/api'

export default {
  name: 'TransactionHistory',
  data() {
    return {
      transactions: [],
    }
  },
  mounted() {
    this.fetchTransactions()
  },
  methods: {
    async fetchTransactions() {
      try {
        const { data } = await api.get(`${import.meta.env.VITE_API_URL}/transaction`)

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

      if (result.isConfirmed) this.deleteTransaction(transactionId)
    },
    async deleteTransaction(id) {
      try {
        await api.delete(`${import.meta.env.VITE_API_URL}/transaction`, {
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
}
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12">
        <VAlert
          v-if="transactions.length === 0"
          type="info"
          class="mt-4"
        >
          No transaction history available.
        </VAlert>
        <VCol
          v-for="transaction in transactions"
          :key="transaction.id"
          cols="12"
        >
          <VCard
            class="mb-1"
            outlined
          >
            <VCardTitle class="d-flex justify-space-between">
              <div>
                <div class="text-h6">
                  {{ transaction.transaction_number }}
                </div>
                <div class="text-subtitle-2">
                  {{ transaction.payment_method }}
                </div>
              </div>
              <VBtn
                icon
                color="error"
                @click="confirmDelete(transaction.id)"
              >
                <VIcon>ri-delete-bin-line</VIcon>
              </VBtn>
            </VCardTitle>

            <VCardText>
              {{ transaction.balance }}
            </VCardText>
          </VCard>
        </VCol>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.v-card-title {
  align-items: center;
}
</style>
