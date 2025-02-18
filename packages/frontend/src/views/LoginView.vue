<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
        <div class="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Left Side (Image) - Shown Only on Desktop -->
            <div class="hidden md:flex w-1/2 bg-purple-100 p-6 items-center justify-center">
                <div class="text-center">
                    <img src="../assets/login-image.png" alt="Team Achieve" class="rounded-lg">
                    <h2 class="mt-4 text-xl font-bold text-purple-700">Team Achieve</h2>
                    <p class="text-gray-600">Your perfect solution for funding your desires</p>
                </div>
            </div>

            <!-- Right Side (Login Form) -->
            <div class="w-full md:w-1/2 p-6">
                <div class="text-center">
                    <img src="../assets/logo.png" alt="Logo" class="mx-auto w-16">
                    <h2 class="mt-4 text-2xl font-bold text-purple-700">Welcome Back</h2>
                    <p class="text-gray-600">Enter your email address and password to access your account.</p>
                </div>

                <form class="mt-6 space-y-4">
                    <div>
                        <label class="block text-gray-700 font-medium">Email Address *</label>
                        <input type="email" placeholder="Enter your email"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium">Password *</label>
                        <div class="relative">
                            <input type="password" placeholder="Enter your password"
                                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <span class="absolute right-4 top-3 cursor-pointer text-gray-500">
                                👁️ <!-- Replace with an icon if needed -->
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2">
                            Remember me
                        </label>
                        <a href="#" class="text-purple-600 hover:underline">Forgot Password?</a>
                    </div>

                    <button class="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition">
                        Sign in
                    </button>
                </form>

                <p class="mt-4 text-center text-gray-600">
                    Don’t have an account? <a href="#" class="text-purple-600 font-semibold hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    </div>
</template>
