<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Discography Tracker</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">

    <h1 class="text-3-xl font-bold mb-6">Discography Tracker</h1>

    <div class="grid gap-6">
        @foreach ($discs as $disc)
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-xl font-semibold">{{ $disc->title }}</h2>
                <p class="text-gray-600">発売日: {{ $disc->release_date }}</p>

                <div class="mt-4 ml-4 border-l-2 pl-4">
                    <h3 class="text-sm font-bold text-gray-500">形態（Editions）</h3>
                    @foreach ($disc->editions as $edition)
                        <div class="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded">
                            <span>{{ $edition->display_name }}</span>

                            <div class="space-x-4">
                                @php
                                    // Editionモデルに書いた userStatus() リレーションを利用
                                    $status = $edition->userStatus;
                                @endphp

                                <label class="inline-flex items-center">
                                    <input type="checkbox" class="form-checkbox"
                                           {{ optional($status)->is_purchased ? 'checked' : '' }}>
                                    <span class="ml-2 text-sm">購入済</span>
                                </label>

                                <label class="inline-flex items-center">
                                    <input type="checkbox" class="form-checkbox"
                                           {{ optional($status)->is_wishlist ? 'checked' : '' }}>
                                    <span class="ml-2 text-sm">欲しい</span>
                                </label>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach
    </div>

</body>
</html>