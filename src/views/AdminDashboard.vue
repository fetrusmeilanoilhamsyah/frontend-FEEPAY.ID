<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0b0f1a] transition-colors duration-500">
    <!-- Top Progress Bar (Visual Only) -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-right from-primary to-blue-500 z-[100] opacity-50"></div>

    <div class="flex flex-col lg:flex-row min-h-screen">
      <!-- SIDEBAR - DESKTOP ONLY -->
      <aside class="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-border bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl z-50">
        <div class="p-8">
          <div class="flex items-center gap-3 mb-10">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShoppingBag class="text-white" :size="20" />
            </div>
            <div>
              <h1 class="text-lg font-black tracking-tight leading-none text-foreground">ADMIN</h1>
              <span class="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Panel Kontrol</span>
            </div>
          </div>

          <nav class="space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group relative overflow-hidden"
              :class="activeTab === tab.value
                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                : 'text-foreground/60 hover:text-foreground hover:bg-muted'"
            >
              <component 
                :is="tab.icon" 
                :size="18" 
                :class="activeTab === tab.value ? 'text-white' : 'text-foreground/40 group-hover:text-primary'"
              />
              <span class="relative z-10">{{ tab.label }}</span>
              <div v-if="activeTab === tab.value" class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] animate-shimmer"></div>
            </button>
          </nav>
        </div>

        <div class="mt-auto p-6 border-t border-border">
          <div class="p-4 rounded-2xl bg-muted/50 border border-border/50">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users :size="14" class="text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Session Admin</p>
                <p class="text-xs font-bold truncate">Manage & Sync</p>
              </div>
            </div>
            <button @click="handleLogout" class="w-full py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              Keluar Panel Admin
            </button>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="flex-1 min-w-0">
        <!-- MOBILE HEADER -->
        <header class="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-border px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag class="text-white" :size="16" />
              </div>
              <h1 class="text-base font-black tracking-tight text-foreground">DASHBOARD <span class="text-primary">ADMIN</span></h1>
            </div>
            <div class="flex items-center gap-2">
              <button @click="handleLogout" class="p-2 rounded-lg bg-muted text-red-500">
                <Smartphone :size="18" />
              </button>
            </div>
          </div>
        </header>

        <div class="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto lg:mx-0">
          <!-- Welcome Section -->
          <div class="mb-8 lg:mb-12 reveal reveal--up" v-reveal>
            <h2 class="text-2xl lg:text-4xl font-black tracking-tighter mb-2">
              Selamat Datang, <span class="text-primary">Admin</span>
            </h2>
            <p class="text-sm lg:text-base text-muted-foreground font-medium">
              Monitor performa bisnis dan kelola inventaris digital Anda dengan presisi.
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
            <template v-if="loadingStats">
              <div v-for="i in 4" :key="i" class="h-32 rounded-3xl bg-muted animate-pulse border border-border/50"></div>
            </template>
            
            <template v-else>
              <div 
                v-for="(card, idx) in statCards" 
                :key="idx"
                class="premium-card reveal reveal--up"
                v-reveal
                :style="{ '--delay': (idx * 0.1) + 's' }"
              >
                <div class="flex flex-col gap-4">
                  <div class="flex items-center justify-between">
                    <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" :class="card.bg">
                      <component :is="card.icon" :size="20" />
                    </div>
                    <span class="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-widest">{{ card.label }}</span>
                  </div>
                  <div class="flex items-end justify-between">
                    <div class="text-xl lg:text-3xl font-black tracking-tight">{{ card.value }}</div>
                    <div v-if="card.trend" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">+12%</div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- DIGIFLAZZ + TABS WRAPPER -->
          <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mb-8 lg:mb-12 reveal" v-reveal>
            <!-- Saldo Digiflazz Widget -->
            <div 
              class="w-full lg:w-[450px] flex-shrink-0 premium-card relative overflow-hidden group"
              :class="{ 'border-red-500/30 bg-red-500/[0.02]': digiflazzBalance?.is_low }"
            >
              <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wallet :size="80" />
              </div>
              
              <div class="relative z-10">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                      <Wallet :size="24" />
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Saldo Provider</p>
                      <h4 class="text-sm font-black text-foreground">Digiflazz API</h4>
                    </div>
                  </div>
                  <button
                    @click="fetchBalance"
                    :disabled="loadingBalance"
                    class="p-2.5 rounded-xl bg-muted hover:bg-muted-hover transition-all disabled:opacity-50"
                  >
                    <RefreshCw :size="16" :class="{ 'animate-spin': loadingBalance }" />
                  </button>
                </div>

                <div class="space-y-4">
                  <template v-if="loadingBalance">
                    <div class="h-10 w-48 bg-muted animate-pulse rounded-xl"></div>
                  </template>
                  <template v-else-if="!digiflazzBalance">
                    <p class="text-sm font-bold text-muted-foreground">Konfigurasi Digiflazz Belum Siap</p>
                  </template>
                  <template v-else>
                    <div 
                      class="text-3xl font-black tracking-tighter"
                      :class="digiflazzBalance.is_low ? 'text-red-500' : 'text-foreground'"
                    >
                      {{ digiflazzBalance.balance_formatted }}
                    </div>
                    <div v-if="digiflazzBalance.is_low" class="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertTriangle :size="16" class="text-red-500" />
                      <span class="text-[10px] font-black text-red-500 uppercase tracking-widest">Saldo Kritis! Segera Top Up</span>
                    </div>
                    <div v-else class="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle :size="16" class="text-emerald-500" />
                      <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Koneksi API Lancar (Stable)</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- TABS - MOBILE ONLY -->
            <div class="lg:hidden w-full overflow-x-auto pb-4">
              <div class="inline-flex gap-3 px-1">
                <button
                  v-for="tab in tabs"
                  :key="tab.value"
                  @click="activeTab = tab.value"
                  class="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap"
                  :class="activeTab === tab.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white dark:bg-dark-900 text-muted-foreground border border-border'"
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>
          </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="space-y-6 lg:space-y-10 reveal" v-reveal>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-dark-900/50 backdrop-blur-md border border-border rounded-2xl shadow-sm">
            <Zap :size="16" class="text-emerald-500" />
            <span class="text-xs font-black uppercase tracking-widest text-foreground">Markup Global</span>
            <div class="h-4 w-px bg-border mx-2"></div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-muted-foreground">RP</span>
              <input
                v-model.number="bulkMargin"
                type="number"
                class="w-20 bg-transparent text-sm font-black outline-none"
                placeholder="2000"
              />
              <button
                @click="handleBulkMargin"
                :disabled="isBulkUpdating || !bulkMargin"
                class="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-tighter rounded-lg disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>

          <button 
            @click="handleSyncProducts" 
            :disabled="isSyncing"
            class="group flex items-center justify-center gap-3 px-6 py-3 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw :size="16" :class="{ 'animate-spin': isSyncing }" />
            <span>{{ isSyncing ? 'Synchronizing...' : 'Sync Digiflazz' }}</span>
          </button>
        </div>

        <!-- Grouped Products -->
        <div class="space-y-8 lg:space-y-12">
          <div v-for="(group, category) in groupedProducts" :key="category" class="reveal reveal--up" v-reveal>
            <div class="flex items-center gap-4 mb-4 lg:mb-6">
              <div class="h-6 w-1 bg-primary rounded-full"></div>
              <h3 class="text-lg lg:text-xl font-black tracking-tight">{{ category }}</h3>
              <span class="px-2 py-0.5 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{{ group.length }} Items</span>
            </div>

            <div class="premium-card p-0 overflow-hidden shadow-sm">
              <!-- Desktop Table -->
              <div class="hidden lg:block overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="bg-muted/30 border-b border-border">
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Detail</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Modal</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Jual</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Profit</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border">
                    <tr v-for="p in group" :key="p.id" class="hover:bg-muted/20 transition-colors">
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                            <Zap :size="14" class="text-primary opacity-50" />
                          </div>
                          <p class="text-sm font-bold text-foreground">{{ p.name }}</p>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-right font-mono text-xs text-muted-foreground">
                        Rp {{ formatPrice(p.cost_price) }}
                      </td>
                      <td class="px-6 py-4 text-right font-black text-sm text-foreground">
                        Rp {{ formatPrice(p.selling_price) }}
                      </td>
                      <td class="px-6 py-4 text-right">
                        <span class="text-emerald-500 font-bold text-xs">+{{ Math.round((p.selling_price - p.cost_price) / p.cost_price * 100) }}%</span>
                        <p class="text-[10px] font-black text-emerald-600/60 leading-none">Rp {{ formatPrice(p.selling_price - p.cost_price) }}</p>
                      </td>
                      <td class="px-6 py-4 text-center">
                        <button @click="openEditPriceModal(p)" class="p-2 rounded-xl bg-muted hover:bg-muted-hover transition-all text-muted-foreground hover:text-primary">
                          <Zap :size="16" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="lg:hidden divide-y divide-border">
                <div v-for="p in group" :key="p.id" class="p-4">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-xs font-black text-foreground">{{ p.name }}</p>
                    <button @click="openEditPriceModal(p)" class="p-2 rounded-lg bg-muted text-primary">
                      <Zap :size="14" />
                    </button>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <div>
                      <p class="text-[8px] font-bold text-muted-foreground uppercase">Modal</p>
                      <p class="text-[10px] font-bold">{{ formatPrice(p.cost_price) }}</p>
                    </div>
                    <div>
                      <p class="text-[8px] font-bold text-muted-foreground uppercase">Profit</p>
                      <p class="text-[10px] font-black text-emerald-500">+{{ formatPrice(p.selling_price - p.cost_price) }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[8px] font-bold text-muted-foreground uppercase">Jual</p>
                      <p class="text-sm font-black text-primary">Rp{{ formatPrice(p.selling_price) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'" class="reveal" v-reveal>
        <div class="premium-card p-0 overflow-hidden min-h-[400px]">
          <div v-if="orders.length === 0" class="flex flex-col items-center justify-center py-20">
            <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag :size="32" class="opacity-20" />
            </div>
            <p class="text-sm font-bold text-muted-foreground">Belum ada pesanan masuk</p>
          </div>
          
          <template v-else>
            <!-- Desktop Table -->
            <div class="hidden lg:block overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-muted/30 border-b border-border">
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Number</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="order in orders" :key="order.id" class="hover:bg-muted/20 transition-colors">
                    <td class="px-6 py-4 font-mono text-xs font-bold">{{ order.order_id }}</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <Smartphone :size="12" class="text-muted-foreground" />
                        <span class="text-sm font-bold">{{ order.target_number }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="status-badge" :class="order.status">{{ order.status }}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button 
                          v-if="order.status === 'processing'" 
                          @click="handleSyncOrder(order.order_id)"
                          class="px-4 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all"
                        >
                          Sync Status
                        </button>
                        <button 
                          v-if="order.status === 'pending'"
                          @click="openConfirmModal(order)"
                          class="px-4 py-1.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 hover:scale-[1.05] transition-all"
                        >
                          Confirm
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div class="lg:hidden divide-y divide-border">
              <div v-for="order in orders" :key="order.id" class="p-4">
                <div class="flex items-center justify-between mb-4">
                  <p class="font-mono text-[10px] font-black">{{ order.order_id }}</p>
                  <span class="status-badge scale-75 transform-origin-right" :class="order.status">{{ order.status }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-sm font-bold">{{ order.target_number }}</p>
                  <div class="flex gap-2">
                    <button v-if="order.status === 'processing'" @click="handleSyncOrder(order.order_id)" class="p-2 rounded-lg bg-orange-500/10 text-orange-500"><RefreshCw :size="14" /></button>
                    <button v-if="order.status === 'pending'" @click="openConfirmModal(order)" class="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase">CONFIRM</button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="reveal" v-reveal>
        <div class="premium-card p-0 overflow-hidden">
          <div v-if="loadingUsers" class="flex flex-col items-center justify-center py-20">
            <Loader2 class="animate-spin text-primary opacity-20" :size="32" />
          </div>
          
          <template v-else>
             <!-- Desktop Table -->
             <div class="hidden lg:block overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-muted/30 border-b border-border">
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Identity</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Role</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Registered</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="user in usersList" :key="user.id" class="hover:bg-muted/20 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-xs font-black">
                          {{ (user.name || '?')[0].toUpperCase() }}
                        </div>
                        <div>
                          <p class="text-sm font-bold text-foreground leading-none mb-1">{{ user.name }}</p>
                          <p class="text-xs text-muted-foreground">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p class="font-mono text-xs text-foreground">{{ user.phone || '-' }}</p>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest"
                        :class="user.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <p class="text-xs text-muted-foreground">{{ new Date(user.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div class="lg:hidden divide-y divide-border">
              <div v-for="user in usersList" :key="user.id" class="p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                  {{ (user.name || '?')[0].toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold truncate">{{ user.name }}</p>
                  <p class="text-[10px] text-muted-foreground truncate">{{ user.email }}</p>
                </div>
                <span class="px-2 py-0.5 rounded bg-muted text-[8px] font-black uppercase">{{ user.role }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>

    </div>

    <!-- Edit Price Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditPriceModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" @click.self="closeEditPriceModal">
          <div class="premium-card w-full max-w-md !bg-white dark:!bg-[#111827] border-none shadow-2xl p-8">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
              <Zap :size="28" />
            </div>
            <h2 class="text-2xl font-black tracking-tighter mb-1">Ubah Harga</h2>
            <p class="text-sm text-muted-foreground font-medium mb-8">{{ editingProduct?.name }}</p>
            
            <div class="space-y-6 mb-8">
              <div>
                <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Harga Jual (IDR)</label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">RP</div>
                  <input v-model="newSellingPrice" type="number" class="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted border-none font-black text-xl outline-none focus:ring-2 ring-primary/30 transition-all" />
                </div>
              </div>
            </div>

            <div class="flex gap-4">
              <button @click="closeEditPriceModal" class="flex-1 py-4 rounded-2xl bg-muted font-black text-[10px] uppercase tracking-widest transition-all hover:bg-muted-hover">Batal</button>
              <button @click="saveNewPrice" class="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- PIN Modal Component -->
    <Teleport to="body">
      <PINModal 
        v-if="showPinModal" 
        :title="pinModalTitle" 
        :subtitle="pinModalSubtitle" 
        @confirmed="handlePinConfirmed" 
        @close="closePinModal" 
      />
    </Teleport>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 bg-dark-950 text-white rounded-2xl flex items-center gap-4 shadow-2xl border border-white/10">
        <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <CheckCircle :size="16" />
        </div>
        <span class="text-[10px] font-black uppercase tracking-tighter">{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { ShoppingBag, Clock, TrendingUp, RefreshCw, Loader2, Check, Zap, Wallet, AlertTriangle, MessageCircle, Users, Smartphone, CheckCircle } from 'lucide-vue-next'
import PINModal from '../components/PINModal.vue'
import api from '../services/api'
import { useAuth } from '../composables/useAuth'

const { setAdminPin, logout } = useAuth()

const handleLogout = async () => {
  if (!confirm('Yakin ingin logout dari panel admin?')) return
  await logout()
  router.push('/admin/login')
}

const activeTab = ref('products')
const stats = ref({})
const loadingStats = ref(true)
const products = ref([])
const orders = ref([])
const lastOrderCount = ref(0)
const isSyncing = ref(false)
const isFetching = ref(false)
const isBulkUpdating = ref(false)
const bulkMargin = ref(null)
const usersList = ref([])
const loadingUsers = ref(false)

const digiflazzBalance = ref(null)
const loadingBalance = ref(false)

const showPinModal = ref(false)
const pinModalTitle = ref('')
const pinModalSubtitle = ref('')
const pendingAction = ref(null)

const statCards = computed(() => [
  { label: 'Total Pesanan', value: stats.value.overview?.total_orders || 0, icon: ShoppingBag, bg: 'bg-blue-500' },
  { label: 'Pending', value: stats.value.overview?.pending_orders || 0, icon: Clock, bg: 'bg-orange-500' },
  { label: 'Total Pengguna', value: stats.value.overview?.total_users || 0, icon: Users, bg: 'bg-purple-500' },
  { label: 'Revenue', value: `Rp ${formatPrice(stats.value.overview?.total_revenue || 0)}`, icon: TrendingUp, bg: 'bg-emerald-500', trend: true }
])
const showEditPriceModal = ref(false)
const editingProduct = ref(null)
const newSellingPrice = ref(0)
const showToast = ref(false)
const toastMessage = ref('')

const AUTO_REFRESH_INTERVAL = 60000
let autoRefreshTimer = null

const tabs = [
  { value: 'products', label: 'Produk', icon: ShoppingBag },
  { value: 'orders', label: 'Pesanan', icon: Clock },
  { value: 'users', label: 'Pengguna', icon: Users },
  { value: 'whatsapp', label: 'WhatsApp', icon: Smartphone }
]

const groupedProducts = computed(() => {
  const groups = {}
  products.value.forEach(product => {
    const category = product.category || 'Lainnya'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(product)
  })
  
  Object.keys(groups).forEach(category => {
    groups[category].sort((a, b) => a.name.localeCompare(b.name))
  })
  
  return groups
})

const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(p)

// ─── WA Gateway State ──────────────────────────────────────────────────────────
const waStatus = ref('disconnected') // 'connected' | 'connecting' | 'disconnected' | 'offline'
const waPhone = ref(null)
const waQR = ref(null)
const waLoading = ref(false)
const waDisconnecting = ref(false)
let waPollTimer = null

const fetchWAStatus = async (silent = false) => {
  if (!silent) waLoading.value = true
  try {
    const res = await api.wa.status()
    waStatus.value = res.status || 'disconnected'
    waPhone.value = res.phone || null
    waQR.value = res.qr || null
  } catch {
    waStatus.value = 'offline'
    waPhone.value = null
    waQR.value = null
  } finally {
    waLoading.value = false
  }
}

const handleWADisconnect = async () => {
  if (!confirm('Yakin ingin logout WhatsApp? QR baru akan muncul untuk scan ulang.')) return
  waDisconnecting.value = true
  try {
    await api.wa.disconnect()
    showToastNotification('Logout berhasil. Tunggu QR code baru muncul...')
    waStatus.value = 'connecting'
    waQR.value = null
    // Mulai polling cepat setelah disconnect
    setTimeout(() => fetchWAStatus(true), 3000)
  } catch {
    showToastNotification('Gagal disconnect. Cek apakah gateway sudah berjalan.')
  } finally {
    waDisconnecting.value = false
  }
}

const showToastNotification = (m) => {
  toastMessage.value = m
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const fetchAllData = async (silent = false) => {
  if (isFetching.value) return
  isFetching.value = true

  if (!silent && products.value.length === 0) {
    loadingStats.value = true
  }

  try {
    const [s, p, o] = await Promise.all([
      api.dashboard.getStats().catch(() => stats.value || {}),
      api.products.getAll().catch(() => products.value || []),
      api.orders.getAll().catch(() => ({ data: orders.value || [] }))
    ])

    const currentOrders = o.data || o

    if (lastOrderCount.value > 0 && currentOrders.length > lastOrderCount.value) {
      new Audio('/notification.mp3/2869-preview.mp3').play().catch(() => {})
      showToastNotification('Pesanan Baru Masuk!')
    }

    if (s && Object.keys(s).length > 0) stats.value = s
    if (p && p.length > 0) products.value = p
    if (currentOrders && currentOrders.length >= 0) orders.value = currentOrders

    lastOrderCount.value = currentOrders.length
  } catch (e) {
    console.error('Fetch Error:', e)
  } finally {
    loadingStats.value = false
    isFetching.value = false
  }
}

const fetchUsers = async () => {
  if (loadingUsers.value) return
  loadingUsers.value = true
  try {
    const res = await api.users.getAll()
    usersList.value = res.data || res || []
  } catch (e) {
    showToastNotification('Gagal mengambil daftar pengguna')
  } finally {
    loadingUsers.value = false
  }
}

const fetchBalance = async () => {
  if (loadingBalance.value) return
  loadingBalance.value = true
  try {
    const result = await api.dashboard.getBalance()
    digiflazzBalance.value = result
    if (result.is_low) {
      showToastNotification('⚠️ Saldo Digiflazz hampir habis! Segera top up.')
    }
  } catch (e) {
    showToastNotification('Gagal cek saldo: ' + (e.message || 'Error'))
    digiflazzBalance.value = null
  } finally {
    loadingBalance.value = false
  }
}

const handleSyncProducts = async () => {
  if (isSyncing.value) return
  isSyncing.value = true
  showToastNotification('Memulai sinkronisasi produk...')
  try {
    const result = await api.products.sync()
    showToastNotification(result.message || 'Produk berhasil disinkronkan!')
    await fetchAllData()
  } catch (e) {
    showToastNotification(e.message || 'Gagal sinkronisasi produk')
  } finally {
    isSyncing.value = false
  }
}

const handleBulkMargin = async () => {
  if (!bulkMargin.value || bulkMargin.value <= 0) {
    showToastNotification('Masukkan nominal margin dulu!')
    return
  }
  pinModalTitle.value = 'Terapkan Margin Semua Produk'
  pinModalSubtitle.value = `Margin Rp ${formatPrice(bulkMargin.value)} akan diterapkan ke SEMUA produk`
  pendingAction.value = { type: 'bulk_margin', data: { margin: bulkMargin.value } }
  showPinModal.value = true
}

const handleSyncOrder = async (id) => {
  showToastNotification('Menyinkronkan...')
  try {
    const res = await api.orders.sync(id)
    showToastNotification(res.message)
    await fetchAllData(true)
  } catch (e) {
    showToastNotification('Sinkronisasi gagal')
  }
}

const handlePinConfirmed = async (pin) => {
  setAdminPin(pin)
  const action = pendingAction.value
  showPinModal.value = false
  showToastNotification('Memproses...')

  try {
    if (action.type === 'confirm_order') {
      await api.orders.confirm(action.data.id)
      const order = orders.value.find(o => o.id === action.data.id)
      if (order) order.status = 'processing'
    }

    if (action.type === 'bulk_margin') {
      isBulkUpdating.value = true
      try {
        const result = await api.products.bulkMargin(action.data.margin)
        showToastNotification(result.message || 'Margin berhasil diterapkan!')
        await fetchAllData(true)
        bulkMargin.value = null
      } catch (e) {
        showToastNotification(e.message || 'Gagal update margin')
      } finally {
        isBulkUpdating.value = false
      }
      return
    }

    showToastNotification('Berhasil!')
    fetchAllData(true)
  } catch (e) {
    showToastNotification('Terjadi kesalahan')
    console.error('Action Error:', e)
  }
}

const openEditPriceModal = (p) => {
  editingProduct.value = p
  newSellingPrice.value = p.selling_price
  showEditPriceModal.value = true
}

const closeEditPriceModal = () => {
  showEditPriceModal.value = false
}

const saveNewPrice = async () => {
  try {
    await api.products.update(editingProduct.value.id, { selling_price: newSellingPrice.value })
    showToastNotification('Harga berhasil diperbarui!')
    closeEditPriceModal()
    await fetchAllData(true)
  } catch (e) {
    showToastNotification('Gagal memperbarui harga')
  }
}

const openConfirmModal = (o) => {
  pinModalTitle.value = 'Konfirmasi Pesanan'
  pinModalSubtitle.value = 'Masukkan PIN untuk melanjutkan'
  pendingAction.value = { type: 'confirm_order', data: o }
  showPinModal.value = true
}

const closePinModal = () => {
  showPinModal.value = false
  pendingAction.value = null
}

// Watch tab change: start/stop WA polling
watch(activeTab, (tab) => {
  if (tab === 'whatsapp') {
    fetchWAStatus()
    waPollTimer = setInterval(() => fetchWAStatus(true), 5000)
  } else if (tab === 'users') {
    fetchUsers()
  } else {
    if (waPollTimer) clearInterval(waPollTimer)
  }
})

onMounted(() => {
  fetchAllData()
  fetchBalance()
  autoRefreshTimer = setInterval(() => {
    if (!showPinModal.value && !showEditPriceModal.value) {
      fetchAllData(true)
    }
  }, AUTO_REFRESH_INTERVAL)
})

onUnmounted(() => {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer)
  if (waPollTimer) clearInterval(waPollTimer)
})
</script>

<style scoped>
.premium-card {
  @apply bg-white/60 dark:bg-[#1f2937]/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[32px] p-6 lg:p-8;
  box-shadow:
    0 10px 40px -10px rgba(0, 0, 0, 0.05),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
}
.dark .premium-card {
  box-shadow:
    0 20px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.status-badge {
  @apply px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest;
}
.status-badge.pending { @apply bg-orange-500/10 text-orange-500 border border-orange-500/20; }
.status-badge.processing { @apply bg-blue-500/10 text-blue-500 border border-blue-500/20; }
.status-badge.success { @apply bg-emerald-500/10 text-emerald-500 border border-emerald-500/20; }
.status-badge.failed { @apply bg-red-500/10 text-red-500 border border-red-500/20; }

.animate-shimmer {
  animation: shimmer 2.5s infinite linear;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.reveal--up { transform: translateY(20px); opacity: 0; transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.reveal.active { transform: translateY(0); opacity: 1; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.4s ease, transform 0.4s var(--ease-spring); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 20px); }

/* Widescreen optimization */
@media (min-width: 1440px) {
  .max-w-7xl { max-width: 1400px; }
}
</style>