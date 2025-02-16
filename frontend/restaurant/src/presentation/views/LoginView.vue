<template>
  <div class="flex h-full">
    <!-- Login Section -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
      <h1 class="text-3xl font-bold mb-8">Login</h1>
      <form class="space-y-4">
        <div>
          <input type="email" placeholder="Email" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <input type="password" placeholder="Password" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <button type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">Login</button>
      </form>
      <a href="#" class="text-blue-500 hover:underline mt-4 inline-block">Reset Password</a>
      <button class="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 mt-4">Login
        with Google</button>
    </div>

    <div class="md:w-1/2 bg-cover bg-center hidden md:flex" style="background-image: url('/public/chef.jpg');">
    </div>
  </div>
</template>
